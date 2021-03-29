FROM ubuntu:20.10 AS base

ENV DENO_INSTALL=/usr/local
ENV DENO_DIR=/home/deno/.cache

# Create deno user:group before installation so that the home directory exits
RUN addgroup deno && useradd --gid deno --create-home deno

RUN apt-get update && apt-get install unzip curl -y
RUN curl -fsSL https://deno.land/x/install/install.sh | sh

# Switch to deno user after installing system dependencies
USER deno:deno
WORKDIR /home/deno

ENTRYPOINT ["deno"]

FROM base AS run-base

# Run application, always with integrity verification
# https://deno.land/manual@v1.8.2/linking_to_external_code/integrity_checking#runtime-verification
COPY --chown=deno projects/server_deno/lock.json .
COPY --chown=deno projects/server_deno/.deno-cache ${DENO_DIR}
ENTRYPOINT ["deno", "run", "--allow-net", "--lock=lock.json", "--cached-only"]

FROM run-base AS development

COPY projects/server_deno .

CMD ["--unstable", "--watch", "src/index.ts"]

FROM run-base AS production

# Install application dependencies from lock file
# https://deno.land/manual@v1.8.2/linking_to_external_code/integrity_checking#caching-and-lock-files
COPY projects/server_deno/lock.json .
COPY projects/server_deno/src/deps.ts src/
RUN deno cache --lock=conf/lock.json src/deps.ts

COPY projects/server_deno .

CMD ["src/index.ts"]
