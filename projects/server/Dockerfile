FROM ubuntu:20.10 AS base

ENV DENO_INSTALL=/usr/local
ENV DENO_DIR=/home/deno/.cache

# Create deno user:group before installation so that the home directory exits
RUN addgroup deno && useradd --gid deno --groups deno --create-home deno

RUN apt-get update && apt-get install unzip curl -y
RUN curl -fsSL https://deno.land/x/install/install.sh | sh

# Switch to deno user after installing system dependencies
USER deno:deno
WORKDIR /home/deno

ENTRYPOINT ["deno"]

FROM base AS run-base

# Run application, always with integrity verification
# https://deno.land/manual@v1.8.2/linking_to_external_code/integrity_checking#runtime-verification
COPY --chown=deno projects/server/lock.json .
COPY --chown=deno projects/server/.deno-cache ${DENO_DIR}
COPY --chown=deno projects/server .

# TODO could lock down net to the midishare domain
# TODO could lock down read/write to the database.db file
ENTRYPOINT ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "--lock=lock.json", "--cached-only"]

FROM run-base AS development

CMD ["--unstable", "--watch", "src/index.ts"]

FROM run-base AS production

CMD ["src/index.ts"]
