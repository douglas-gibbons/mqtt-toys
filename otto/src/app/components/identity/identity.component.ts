import { Component, OnInit } from '@angular/core';
import { mqttSettings, deviceSettings } from '../../../environments/environment';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { DeviceService } from '../../services/device.service'

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss']
})
export class IdentityComponent implements OnInit {

  mqttSettings = mqttSettings;
  deviceSettings = deviceSettings;
  protocols = [
    'wss', 'ws'
  ];

  constructor(
    private mqttService: MqttService,
    private deviceService: DeviceService,
  ) {

  }

  ngOnInit() {
  }

  saveSetting(fieldName: string) {
    console.log("Saving setting for " + fieldName);
    localStorage.setItem('mqtt.' + fieldName, mqttSettings[fieldName]);
  }

  saveDeviceSetting(fieldName: string) {
    localStorage.setItem('device.' + fieldName, deviceSettings[fieldName]);
  }

  refresh() {
    this.deviceService.refreshDevices();
    return false;
  }
}
