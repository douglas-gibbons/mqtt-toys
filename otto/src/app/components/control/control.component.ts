import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DeviceService } from '../../services/device.service'

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  private devices;

  constructor(
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
    this.deviceService.getDevices().subscribe(
      (devices) => {
        this.devices = devices
      });
  }

  action(device) {
    if (this.deviceService.isOn(device)) {
      this.deviceService.turnOff(device);
    } else {
      this.deviceService.turnOn(device);
    }
  }


}
