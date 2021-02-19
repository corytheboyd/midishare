# Server

## Production

```
# https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04
adduser node
usermod -aG sudo node
rsync --archive --chown=node:node ~/.ssh /home/node

# https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04
# install nodejs
curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install -y nodejs
sudo apt install build-essential

# https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04

# setup PM2
# moved to deployment script, but maybe that is too much

# SQlite
# I just downloaded the empty database checked in to source control to the root of the project.
cd ~/server
wget https://github.com/corytheboyd/midishare/raw/rewrite/db/database.db
```

### Deployment

```
# pretty much just follow this https://gist.github.com/RobertMcReed/c6963a09962adf22c91e7c1370dffc13
# install pm2 on remote server
sudo npm i -g pm2@4.5.4
```

### Nginx Amplify

Run on remote server only, but maybe can add to development as well?
```
curl -L -O https://github.com/nginxinc/nginx-amplify-agent/raw/master/packages/install.sh
# modify package_name per this comment https://github.com/nginxinc/nginx-amplify-agent/issues/181#issuecomment-662107703
API_KEY='SUPERSECRET' sh ./install.sh

# then, need to install nginx modules stub_status
# added this to a conf.d file
server {
	listen 127.0.0.1:80;
	server_name 127.0.0.1;
	location /nginx_status {
		stub_status on;
		allow 127.0.0.1;
		deny all;
	}
}

# then adding more to format of logs
# https://amplify.nginx.com/docs/guide-metrics-and-metadata.html#additional-nginx-metrics

```

### Nginx Loki Dashboard

https://grafana.com/grafana/dashboards/12559

Needs [http_geoip_module](https://nginx.org/en/docs/http/ngx_http_geoip_module.html), which wasn't installed with nginx at first.

Downloaded latest stable nginx from source: https://nginx.org/en/download.html

Ran `./configure`, was missing [PCRE](https://www.pcre.org/). Dowloaded latest PCRE2 from releases, and installed.

save flags nginx was initially installed with with `nginx -V`

That didn't work, okay fuck it install with `apt install libpcre2-dev` which I found with `apt search pcre2`.

How about
```
apt-get install libpcre3 libpcre3-dev
```

Then it couldn't find openssl, which was installed locally at `/usr/bin/openssl`, so adding it to configure list of flags as suggested (`--with-openssl=<path>`)

Next thing not found, `zlib`. `apt-get install zlib1g-dev`.

Next, `libxslt`. `apt-get install libxslt-dev`.

Next, `the HTTP image filter module requires the GD library.`. The [docs for the module](https://nginx.org/en/docs/http/ngx_http_image_filter_module.html) say you need [libgd](https://libgd.github.io/), install it: `libdg-dev`

Next, `the GeoIP module requires the GeoIP library.`. I think they are after `apt-get install libgeoip-dev`

Success! `make install`. Oh, not quite:
```
make -f objs/Makefile
make[1]: Entering directory '/root/nginx-1.18.0'
cd /usr/bin/openssl \
&& if [ -f Makefile ]; then make clean; fi \
&& ./config --prefix=/usr/bin/openssl/.openssl no-shared no-threads  \
&& make \
&& make install_sw LIBDIR=lib
/bin/sh: 1: cd: can't cd to /usr/bin/openssl
make[1]: *** [objs/Makefile:1852: /usr/bin/openssl/.openssl/include/openssl/ssl.h] Error 2
make[1]: Leaving directory '/root/nginx-1.18.0'
make: *** [Makefile:8: build] Error 2
```

I think I need to install openssl-dev. Removed --with-openssl flag from configure and ran again:

```
./configure --with-cc-opt='-g -O2 -fdebug-prefix-map=/build/nginx-5J5hor/nginx-1.18.0=. -fstack-protector-strong -Wformat -Werror=format-security -fPIC -Wdate-time -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-Bsymbolic-functions -Wl,-z,relro -Wl,-z,now -fPIC' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-debug --with-compat --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module=dynamic --with-http_sub_module --with-http_xslt_module=dynamic --with-stream=dynamic --with-stream_ssl_module --with-mail=dynamic --with-mail_ssl_module --with-http_geoip_module

./configure: error: SSL modules require the OpenSSL library.
You can either do not enable the modules, or install the OpenSSL library
into the system, or build the OpenSSL library statically from the source
with nginx by using --with-openssl=<path> option.
```

Found solution here https://blog.cpming.top/p/mac-nginx-install-with-http-ssl-module
Checked for latest version https://www.openssl.org/source/
It is https://www.openssl.org/source/openssl-1.1.1j.tar.gz

Run configure for nginx again with `--with-openssl=../openssl-1.1.1j`

Success! Running `make` and it's doing its thing

NOPE! Turns out the builtin module doesn't work with the new binary database format (`mmdb`) distributed by maxmind, but there is another module that you can use instead: https://github.com/leev/ngx_http_geoip2_module

First, install this: https://github.com/maxmind/libmaxminddb

Download that module: https://github.com/leev/ngx_http_geoip2_module/archive/master.zip

New configure flags

```
./configure --with-cc-opt='-g -O2 -fdebug-prefix-map=/build/nginx-5J5hor/nginx-1.18.0=. -fstack-protector-strong -Wformat -Werror=format-security -fPIC -Wdate-time -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-Bsymbolic-functions -Wl,-z,relro -Wl,-z,now -fPIC' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-debug --with-compat --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module=dynamic --with-http_sub_module --with-http_xslt_module=dynamic --with-stream=dynamic --with-stream_ssl_module --with-mail=dynamic --with-mail_ssl_module --with-openssl=../openssl-1.1.1j --add-dynamic-module=../ngx_http_geoip2_module-master --with-stream
make
make install
```

Done again, but note from the new module's repo the config is all different.
