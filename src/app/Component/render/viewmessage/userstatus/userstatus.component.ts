import { Component, OnInit } from '@angular/core';

import { ChatServicesService } from '../../../Services/chat-services.service';
import { statusUser } from '../../../../model/interface';

@Component({
  selector: 'app-userstatus',
  templateUrl: './userstatus.component.html',
  styleUrls: ['./userstatus.component.scss'],
})
export class UserstatusComponent implements OnInit {
  
  listUserStatus : statusUser[] = [];
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(private _services : ChatServicesService) { }

  ngOnInit() {
  }


}
