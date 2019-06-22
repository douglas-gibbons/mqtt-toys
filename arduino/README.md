# sensor_sleeper.ino

sensor_sleeper.ino (written for an Arduino mkr1000) is an example of using rtc to sleep and drastically reduce device power consumption.

Features:

* Sends a config MQTT topic (for systems using device auto discovery)
* Sends temperature readings every 10 minutes
* Sleeps in-between readings, reducing the average power consumption to about 1 mW.
* Uses the rtc clock as a timer, with `rtc.setTime(0,0,0)` every time the timer is reset. This seems to be more accurate (?).
