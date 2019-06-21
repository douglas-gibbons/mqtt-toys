FROM raspbian/stretch

RUN \
  apt update && \
  apt-get install -y dirmngr apt-transport-https --install-recommends

COPY snips.list /etc/apt/sources.list.d/snips.list

RUN apt-key adv --keyserver pgp.surfnet.nl --recv-keys D4F50CDCA10A2849

RUN apt-get update
RUN apt-get install -y \
  snips-platform-voice snips-template snips-skill-server alsa-utils snips-watch git python-pip
RUN pip install virtualenv

# RUN apt install -y npm
# RUN npm install -g snips-sam

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
