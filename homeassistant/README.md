# Home Assistant on a Raspberry Pi

The usual way to install Home Assistant on a Raspberry Pi would be to [use hass.io](https://www.home-assistant.io/getting-started/#installing-hassio), but sometimes that's not enough. This provides something a little more configurable. Because of that, don't expect this to be as straight-forward as booting off a hass.io SD card.

Pull requests are welcome!

The docker-compose.yaml can be used to install the following on a Raspberry PI:

* Home Assistant
* Mosquitto MQTT Server
* Snips (for voice recognition)

..but before that you'll probably want to:

* [Install raspian on the Pi](https://www.raspberrypi.org/documentation/installation/installing-images/)
* Expand the root filesystem and enable SSH
* Install [docker machine](https://www.carothers.io/blog/docker-machine-on-raspberry-pi.html) (if that's your thing)
* Set up sound and a microphone (for snips) on the Pi
* [Create a snips assistant and download the zip file](https://console.snips.ai/assistant/). Also see [www.home-assistant.io/components/snips/](https://www.home-assistant.io/components/snips/).
* Copy the data directory to /data on the Pi - this contains configuration files for mosquitto, snips and home assistant. You might want to change these.


### FAQ

#### How do I test the speaker on the Raspberry Pi?

```speaker-test -Dhw:1,0 -c2 -twav```

#### How do I expand the filesystem?

Run `sudo raspi-config`, and find the option in advanced options

#### How do I upload a new assistant zip file?

A little like this (changing the username and hostname of your raspberry Pi as required):

```
ssh pi@raspberrypi rm -Rf /data/snips/assistant
scp assistant.zip pi@raspberrypi:/data/snips/assistant.zip
ssh pi@raspberrypi unzip /data/snips/assistant.zip -d /data/snips
```
