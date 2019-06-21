import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { MqttService, IMqttMessage, MqttConnectionState } from 'ngx-mqtt';
import { mqttSettings, deviceSettings } from '../../environments/environment';
let yaml = require('js-yaml');
import { MessageService, Message, Level } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private devices;
  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private mqttService: MqttService,
    private messageService: MessageService,
  ) {
    this.monitorMqttStatus();
    this.getDevices().subscribe(devices => {
      this.mqttService.connect(mqttSettings);
    });
  }

  private monitorMqttStatus() {
    this.mqttService.onError.subscribe(
      event => {
        this.message(Level.Warning, "MQTT connection failure");
      }
    );

    this.mqttService.onConnect.subscribe(
      () => {
        this.message(Level.Info, "Connected to MQTT broker")
        this.subscribeDevices();
      });
    // this.mqttService.onReconnect.subscribe(
    //   () => {
    //     this.message(Level.Info, "Re-connected to MQTT broker")
    //     this.subscribeDevices();
    //   });
  }

  private message(level: Level, text: string) {
    this.messageService.add(
      new Message(level, text)
    )
  }
  // Refreshes the device list and re-connect to MQTT to trgger re-subscription
  // for new device list
  public refreshDevices() {
    this.messageService.clear();
    this.devices = undefined;
    this.getDevices().subscribe(devices => {
      this.mqttService.disconnect(false);
      this.mqttService.connect(mqttSettings);
    });
  }

  // Returns the devices only fetching them if we don't already have them.
  public getDevices() {
    return new Observable(observer => {
      if (this.devices != undefined) {
        observer.next(this.devices);
        observer.complete();
      } else {
        this.fetchDevices(observer);
      }
    });
  }

  // fetches devices from the deviceUrl
  private fetchDevices(observer) {
    this.http.get(deviceSettings.url, { responseType: 'text' }).subscribe(
      devicesYaml => {
        try {
          let devicesObj = yaml.safeLoad(devicesYaml);
          this.devices = devicesObj;
          this.message(Level.Info, "Loaded devices from " + deviceSettings.url);
          observer.next(this.devices);
          observer.complete();
        } catch (e) {
          this.message(Level.Warning, "Failed to fetch device list: " + e.message)
          observer.error(e);
        }
      },
      e => {
        this.message(Level.Warning, "Failed to fetch device list: " + e.message)
        observer.error(e);
      }
    );
  }

  // Run whenever a connection is established
  subscribeDevices() {

    // Remove any previous subscriptions
    for (let subs of this.subscriptions) {
      subs.unsubscribe();
    }
    this.subscriptions = [];

    console.log("Connection established to MQTT broker, so subscribing to topics")
    for (let device of this.devices) {

      let configTopic = device.topic + '/config';
      let stateTopic = device.topic + '/state';
      let commandTopic = device.topic + '/set';


      // Send config
      // let configMessage =
      //   '{"name": "' + device.description + '", "state_topic": "' + stateTopic + '", "command_topic": "' + commandTopic + '"}'
      // this.publish(configTopic, configMessage, false);

      // Listen for state changes
      let subs = this.mqttService.observeRetained(stateTopic).subscribe((message: IMqttMessage) => {

        // console.log(message);

        device.state = message.payload.toString();
        device.isLoading = false;
      },
        e => this.message(Level.Warning, e.message)
      );
      this.subscriptions.push(subs);
    }
  }

  public publish(topic: string, message: string, retain: boolean): void {
    this.mqttService.unsafePublish(topic, message, { qos: 1, retain: retain });
  }

  public turnOff(device) {
    let commandTopic = device.topic + '/set';
    device.isLoading = true;
    this.publish(commandTopic, "OFF", false);

  }
  public turnOn(device) {
    let commandTopic = device.topic + '/set';
    device.isLoading = true;
    this.publish(commandTopic, "ON", false);
  }
  public isOn(device) {
    return device.state == "ON";
  }

}
