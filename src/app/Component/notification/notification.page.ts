import { Component, OnInit } from '@angular/core';

import { ChatServicesService } from '../Services/chat-services.service';
import { Notifican } from '../../model/interface';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  listNoti= [];
  listNotificantion: Notifican[]= [];

  constructor(private _services: ChatServicesService) {
    this._services.socket.on('Server-notifiAddFr', (notifican: Notifican) => {
      this.listNotificantion.splice(0, 0, notifican)
    })
   }

  async ngOnInit() {
    await this.loadNoti();

    }


  async loadNoti() {
    await this._services.getListNoti(this._services.user._id, this.listNotificantion.length)
    .then( respone => {
      respone.forEach( notification => {
      
        this.listNotificantion.push(notification);
      })
    })
    .catch( err => console.log(err));

  }


  async loadData(event) {
    await this.loadNoti();
    event.target.complete();
   
  }


  




}
