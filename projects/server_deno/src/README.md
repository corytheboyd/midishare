# Server Deno

Just trying out convering the server project to Deno.

Deno makes for a perfect replacement to the shitshow that is build a Node.js project from TypeScript. It makes tons of sense for long term maintenance, and it doesn't look like the project will disappear overnight.

## Development

Ideally, should only interact with `deno` through the docker image, but for now, just [install it on your host machine](https://deno.land/manual@v1.8.2/getting_started/installation) too.

### Dependency management

This project requires dependency integrity through the lock mechanism of deno.

#### Create/update the lock file (from midishare root):
```
(cd projects/server_deno && deno cache --lock=lock.json --lock-write src/deps.ts)
```

#### Install dependencies on host, for IDE support (from midishare root):
```
(cd projects/server_deno && DENO_DIR=.deno-cache deno cache --reload --lock=lock.json src/deps.ts)
```
