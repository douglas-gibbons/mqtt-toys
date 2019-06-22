#include <SPI.h>
#include <WiFi101.h>
#include <MQTT.h>
#include <RTCZero.h>

RTCZero rtc;

const char ssid[] = "SET_TO_YOUR_WIFI_SSID";
const char pass[] = "SET_TO_YOUR_WIFI_PASSWORD";
char mqttHost[] = "SET_TO_YOUR_MQTT_HOST";

const int sensorPin = A0;

char mqttConfigTopic[] = "homeassistant/sensor/temperature/config";
char mqttConfigPayload[] = "{\"name\": \"Temperature\", \"unit_of_measurement\": \"\u00b0C\", \"state_topic\": \"homeassistant/sensor/temperature\"}";
char mqttTemperatureTopic[] = "homeassistant/sensor/temperature";

const int sleepTime = 10; // Minutes

WiFiClient net;
MQTTClient client(512); // Max packet size increased to 512
bool matched = true;

void setup() {
  Serial.begin(9600);      // initialize serial communication

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);

  // Give the serial monitor (if we have one) time to connect
  delay(2 * 1000);

  // Give us ten seconds to be able to update the software
  Serial.println("Waiting 10 seconds for any software updates");
  delay(10 * 1000);
  Serial.println("Done waiting");
  rtc.begin();
}

void loop() {
  delay(100);
  digitalWrite(LED_BUILTIN, HIGH);
  setAlarm();
  getReading();
  digitalWrite(LED_BUILTIN, LOW);
  rtc.standbyMode();
}

void setAlarm() {
  // Just reset the clock
  rtc.setTime(0,0,0);
  rtc.setAlarmTime(00, sleepTime, 00);
  rtc.enableAlarm(rtc.MATCH_MMSS);
}

void getReading() {

  WiFi.begin(ssid, pass);
  client.begin(mqttHost, net);

  if (client.connect(mqttHost)) {
    Serial.print("Connected, so sending readings\n");

    //Take an average of two temperatures
    float temperature = readTemperature(sensorPin);
    delay(200);
    temperature = (temperature + readTemperature(sensorPin))/2;

    client.publish(mqttConfigTopic, mqttConfigPayload, true, 1);
    client.publish(mqttTemperatureTopic, String(temperature), true, 1);

    client.disconnect();
  } else {
    Serial.print("MQTT connection failed\n");
  }
  WiFi.end();
}

/*
   Outputs the temperature reading for a TMP36 sensor connected
   to the given ADC pin
*/
float readTemperature(int pin) {
  int sensorValue = analogRead(pin);
  // Voltage in mV
  float voltage = sensorValue * 3.3 * 1000 / 1024;
  // Conversion from voltage to temperature for TMP36 sensor
  float temperature = (voltage - 500) / 10;
  // Temperature correction (manual correction for specific sensor)
  temperature = temperature - 2.5;
  return temperature;
}
