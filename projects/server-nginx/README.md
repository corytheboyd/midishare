# Server NGINX

## Perl Scripts

This project uses some light Perl scripts. You will only need to install Perl on your machine if you are running the deployment script.

### Installing Perl

You probably have a version installed already, but to ensure it works the same as it does in production you will want the correct version. For that, install [plenv](https://github.com/tokuhirom/plenv).

**Note**: The base `nginx:1.19.6-perl` image itself uses Perl `v5.28.1`, and as such, so do we!

### IDE Support

I can only help you with WebStorm. Just use the `plenv` support already built in, pointing it to the `plenv` binary.
