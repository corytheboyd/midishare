# Midishare

https://midishare.app

Peer-to-peer MIDI keyboard input streaming service connecting music teachers and students in near real-time.

# Inspiration

I was inspired to pursue learning a musical instrument during the great lockdown of 2020. It didn't take long to choose the piano, having always been fascinated by its range and sound.

Learning music is much more than knowing where to put your fingers on an instrument, I found a local music school offering remote lessons and signed up after an intro with the owner of the school.

Being the computer geek that I am, and having worked in professional software development for nearly a decade, I immediately began thinking through ways of using tech to assist in the remote learning of music. Not wanting to jump the gun too early, I worked through lessons for about four months before touching any code, to build up more of a foundation.

Honestly, private lessons work fairly well over traditional teleconferencing software like Zoom, but they aren't perfect. The main pain points I picked up on thus far were:
1. It is hard work to get a camera positioned just right to see the full range of what the other person is doing
1. Zoom audio is heavily optimized for humans talking to humans, not background piano noise

After sleeping on it, I came up with the idea for Midishare. What if instead of trying to capture what I am doing as audio/video I instead captured the MIDI data and forwarded it to a client run by my teacher for realtime playback? The remote peer's client could animate a keyboard and play audio instead, which is many orders of magnitude less data sent over the wire.

Put together a prototype and tested it with my teacher, and it worked!

# Development

| Service | Description | Address |
| --- | ---- | --- |
| Client | The Midishare application | https://localhost:3000 |
| Documentation | Documentation about Midishare components, such as `@midishare/keyboard` | https://localhost:3100 |
| MIDI Inspector | Debugging application for MIDI inputs | https://localhost:3200 |
| API | REST API and WebSocket for Midishare application | https://localhost:4000 |
| CDN | A simple static file server for assets that will be hosted on a CDN | https://localhost:9000 |
| Redis Commander | The Redis GUI, [read more](https://github.com/joeferner/redis-commander) | http://localhost:4100 | 

**Update: I removed that script, it was distracting. TODO Update this section!**

1. Install Docker Engine and Docker Compose.
1. Install dependencies:
    ```
    bin/setup
    ```
   * Note: Assumes you have [`mkcert`](https://mkcert.org/) installed
    
From here, it's a very simple `docker-compose` work flow.

Access the running application in your browser at `https://localhost:3000`.

## bin/dcp

This project makes use of config file composition for shared configuration between development and production tasks. To make working with this a bit easier, I added the `bin/dcp` (Docker ComPose) script to clean up interactions.

Usage:
```
DOCKER_ENV=<dev, prod> bin/dcp <docker-compose commands>
```

For convenience, `bin/dcp-dev` and `bin/dcp-prod` are available as well.

### Examples

All knowledge of the canonical `docker-compose` applies here, so consult the official documentation if needed. However, I'll highlight some common examples here! 

Start the development server:
```
DOCKER_ENV=dev bin/dcp up --detach
```

Build and push the production images:
```
DOCKER_ENV=prod bin/dcp build
DOCKER_ENV=prod bin/dcp push
```

## Package Linking

The Keyboard package is structured and used internals as an NPM module. This comes with it's own fun stack of issues, but it's worth dealing with for the sake of decoupling and, well, publishing bits of work to the world later!

Most things work in the Docker-sphere, but this one requires a bit of work to be done on the host machine in order to preserve intellisense and dependency indexing in your IDE. I prefer not compromising at all on that, because that's how you get unmaintainable trash heaps of code.

Okay so what you have to do:

```
# Make sure you're doing this against the correct Node version
nvm use

# Run the link script, which does the following:
# 1. Create the global symlink (as @midishare/keyboard, per the package.json)
# 2. Link @midishare/keyboard to dependant projects
bin/link
```

It's really not that bad. Yeah yeah, I know your "BUT THIS DOESN'T SCALE" sense is flying off the charts. Look, this is a tiny project, not a Google monorepo. There really won't end up being much/any more than `@midishare/keyboard` being shared like this, and there won't be many more dependants of packages than the edge projects (`client`, etc.). 

### Why not Docker volumes?

What I also ended up doing is hosting the keyboard dist on the host and bind mouinting it to dependant projects. The cleaner approach feels like it would be to instead share the build entire through Docker volumes defined in compose.

The absolutely biggest reason I avoided that was to support IDE intellisense-- trivially accomplished by writing keyboard `dist` to the host. This is far more worth than some fetishization of "pure" contianerization. This is all relevant only to the development build anyway.
