import { Component, OnInit } from '@angular/core';

import { ChatServicesService } from '../Services/chat-services.service';

export interface Notifican{
  _id: String;
  _idsend: String;
  msg: String;
  urlImg: String;
  created: Number;
  server: Boolean;
  status: String;
  name: String;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  listNoti= [];
  listNotificantion: Notifican[]= [];
  start;
  end;

  constructor(private _services: ChatServicesService) {
    this._services.socket.on('Server-notifiAddFr', (notifican: Notifican) => {
      this.listNotificantion.splice(0, 0, notifican)
      //this._services.user.notification.push(notifican._id);
      // console.log(this.listNotificantion);
    })
   }

  async ngOnInit() {
    // await this._services.reloadUser(this._services.user._id)
    // .then( respone => {
    //   this._services.user= respone;
    //   console.log('day la line 38');
    //   console.log(this._services.user)
    // })
    // .catch(err => console.log(err))


    this.start= this._services.user.notification.length-1;
    this.end= this.start-10;
    if(this.end < -1) this.end= -1; 
    await this.loadNoti();

    }


  async loadNoti() {
    if(this.start == -1) return;
    this.listNoti= [];
    for(let i= this.start ; i > this.end; i-- ) { 
      this.listNoti.push(this._services.user.notification[i]);  
    }
  
    this.start= this.end;
    this.end= this.start-10;
    if(this.end < -1) this.end= -1;

    await this._services.getListNoti(this.listNoti)
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
    // }
   
  }


  




}
