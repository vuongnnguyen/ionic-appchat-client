import { Component, OnInit, Input } from '@angular/core';

import { ChatServicesService } from '../../Services/chat-services.service';
import { ModalController } from '@ionic/angular';
import { AddmemberComponent } from './addmember/addmember.component';
import { NicknamesComponent } from './nicknames/nicknames.component';
import { room , handelNickName, objUser } from '../../../model/interface';

@Component({
  selector: 'app-setting-room',
  templateUrl: './setting-room.component.html',
  styleUrls: ['./setting-room.component.scss'],
})
export class SettingRoomComponent implements OnInit {

  @Input() vv: string;
  @Input() room: room; 
  @Input() idMsgEnd: string;
  @Input() idroom: string; 
  @Input() listNameUser: objUser[];
  @Input() listAllNickName: handelNickName[];

  constructor(private _services: ChatServicesService, public modalController: ModalController) { }

  ngOnInit() {}

  leaveRoom() {
    const obj= { idroom: this.idroom, iduser: this._services.user._id};
    this._services.managementRoom(obj, 'http://vuongdeptrai.herokuapp.com/user/leave-room')
    .then( res => {
      this._services.socket.emit('Client-send-leave-room', obj);
    })
    .catch( err => { console.log(err.message)});
  }

  async changeNickNames() {
    const modal= await this.modalController.create({
      component: NicknamesComponent,
      componentProps: {
        'idroom': this.idroom,
        'listAllNickName': this.listAllNickName,
      }
    });
    return await modal.present();
  }

  async addMember() {
 
    const modal = await this.modalController.create({
      component: AddmemberComponent,
      componentProps: {
        'room': this.room,
        'listAllNickName': this.listAllNickName,// k can
        'listNameUser': this.listNameUser
      }
    });
    return await modal.present();
  } 

  unBlockRoom() {
    const obj= { iduser: this._services.user._id, idroom: this.idroom};
    this._services.managementRoom(obj, 'http://vuongdeptrai.herokuapp.com/user/unblock-room')
    .then( res => {
      this._services.user.room.push(this.idroom);
      const index = this._services.user.block.findIndex( docs => {
        return docs == this.idroom;
      });
      if(index != -1) this._services.user.block.splice(index, 1);
      this._services.socket.emit('Client-send-unblock-room', obj)
    })
  }

  blockRoom(){
    // this._services.user.block.push(this.idroom);    
    const obj = { iduser: this._services.user._id, idroom: this.idroom };
    this._services.managementRoom(obj, 'http://vuongdeptrai.herokuapp.com/user/block-room')
    .then( res => { 
      this._services.user.block.push(this.idroom);
      const indexs = this._services.user.room.findIndex( docs => {
        return docs == this.idroom;
      });
      if(indexs != -1) this._services.user.room.splice(indexs, 1)
      this._services.socket.emit('Client-send-blocked-room', obj)
    })
    .catch( err => {
      console.log(err.message);
    })
  }

  isBlocked(): boolean {
    const index = this._services.user.block.findIndex( docs => {
      return docs == this.idroom;
    });
    if(index == -1) return false;
    return true;
  }

  deleteMessagesinRoom() {
    // this.listMsg.splice(index, 1);
    this._services.user.hidemsg.push(this.room.idroom);
 
    const obj= { idroom: this.room.idroom, iduser: this._services.user._id, time: + new Date().getTime(), idmsg: this.idMsgEnd}
    this._services.deleteAllMsg(obj)
    .then( res => { 
      this._services.socket.emit('Client-send-deleteAllmsg-inRoom', obj);
      const indexs = this._services.user.hidemsg.findIndex( hide => {
        return hide == this.idroom;
      });
      if(indexs== -1) return;
      this._services.user.hidemsg.splice(indexs, 1)
    })
    .catch( err =>{ 
      const indexs = this._services.user.hidemsg.findIndex( hide => {
        return hide == this.idroom
      });
      if(indexs == -1) return;
      this._services.user.hidemsg.splice(indexs, 1)
      console.log(err)
    });
  }


  showRoom() { 
    const index = this._services.user.hidemsg.findIndex( docs => {
      return docs == this.idMsgEnd
    });
    if(index == -1) return;
    this._services.user.hidemsg.splice(index, 1);
    const obj = { idmsg: this.idMsgEnd, iduser: this._services.user._id };
    this._services.managementRoom(obj, 'http://vuongdeptrai.herokuapp.com/user/show-room')
    .then( res => this._services.socket.emit('Client-send-show-room', obj))
    .catch( err => {
      console.log(err.message);
      this._services.user.hidemsg.push(this.idMsgEnd);
    })
  }

  hideRoom() {// an tin nhan
    const index= this._services.user.hidemsg.findIndex( docs => {
      return docs == this.idMsgEnd
    });
    if(index != -1) return;
    this._services.user.hidemsg.push(this.idMsgEnd);
    const obj = { idmsg: this.idMsgEnd, iduser: this._services.user._id };
    // this._services.socket.emit('Client-send-hide-room', obj)
    this._services.managementRoom(obj, 'http://vuongdeptrai.herokuapp.com/user/hide-room')
    .then( res => {this._services.socket.emit('Client-send-hide-room', obj)})
    .catch( err => {
      const index= this._services.user.hidemsg.findIndex( dosc => {
        return dosc== this.idMsgEnd
      });
      if(index == -1) return;
      this._services.user.hidemsg.splice(index, 1);
      console.log(err);
    })
  }

  isHideMsg() {
    const index = this._services.user.hidemsg.findIndex( docs => {
      return docs == this.idMsgEnd;
  });
  if(index == -1) return false;
  return true;
  }

  missNotification() {
    const index = this._services.user.dismissroom.findIndex( docs => {
      return docs == this.room.idroom;
    });
    if(index == -1) return;
    const obj = { idroom: this.room.idroom, iduser: this._services.user._id};
    // this._services.socket.emit('Client-send-miss-room', obj);
    this._services.user.dismissroom.splice( index, 1);
    this._services.managementRoom(obj, 'http://vuongdeptrai.herokuapp.com/user/miss-room')
    .then( res => { this._services.socket.emit('Client-send-miss-room', obj)} )
    .catch( err => {
      const index = this._services.user.dismissroom.findIndex( dosc => {
        return dosc == this.room.idroom;
      });
      if(index != -1) return;
      this._services.user.dismissroom.push(this.room.idroom);
      console.log(err);
    })

  }

  dismissNotification() {
    const index = this._services.user.dismissroom.findIndex( docs => {
      return docs == this.room.idroom;
    })
    if(index != -1) return;
    const obj = { idroom: this.room.idroom, iduser: this._services.user._id };
    //this._services.socket.emit('Client-send-dismiss-room', obj);
    // this._services.socket.emit('Client-send-dismiss-room', obj)
    this._services.user.dismissroom.push(this.room.idroom);
    this._services.managementRoom(obj, 'http://vuongdeptrai.herokuapp.com/user/dismiss-room')
    .then( res => { this._services.socket.emit('Client-send-dismiss-room', obj);})
    .catch( err => {
      const index = this._services.user.dismissroom.findIndex( dosc => {
        return dosc == this.room.idroom;
      });
      if(index == -1) return;
      this._services.user.dismissroom.splice(index, 1);
      console.log(err);
    })
  }

  isDissmissNotification(): boolean {
    const index = this._services.user.dismissroom.findIndex( docs => {
      return docs == this.room.idroom;
    });
    if(index == -1) return false;
    return true;
  }

}
