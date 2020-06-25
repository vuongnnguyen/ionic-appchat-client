import { Component, OnInit } from '@angular/core';
import { ChatServicesService } from '../Services/chat-services.service';
import { AlertController } from '@ionic/angular';;
import { listAccept, nickName, room, User, msg, objUser } from '../../model/interface';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {
  users: listAccept[] = [];
  rooms: room[] = [];
  nickNames: nickName[] = [];

  msgs: msg[] = [];
  listMsg: msg[] = [];
  arrSendMsg = [];   

  constructor(private _services: ChatServicesService, private alertCtrl: AlertController) { }
  async ngOnInit() {
    this.loadMsg();
  }
  async createGroup() {
    const createdGroup= await this.alertCtrl.create({
      header: 'Tao Group',
      message: 'Nhap ten group.',
      inputs: [{
        name: 'nameGroup',
        type: 'text',
        placeholder: 'Nhap ten Group' 
      }],
      buttons: [
        {
        text: 'Cancel',
        handler: () => console.log('cancel'),
        role: 'cancel'
        },
        {
          text: 'Create',
          handler: form => {
            let obj= {username: this._services.user.name ,iduser: this._services.user._id, namegroup: form.nameGroup, idroom: `${this._services.user._id}${new Date().getTime()}${Math.floor(Math.random() * 10)}` };
            if(form.nameGroup == '') {
              obj= {username: this._services.user.name, iduser: this._services.user._id, namegroup: `${new Date().getTime()}${Math.floor(Math.random() * 10)}`, idroom: `${this._services.user._id}${new Date().getTime()}${Math.floor(Math.random() * 10)}`};
            }
            this._services.createGroup(obj)
            .then( res => {
          
              this.listMsg.splice(0, 0, res)
            })
            .catch( err => console.log(err.message));
          }
        }
      ]
    });
    await createdGroup.present();
  }


  async loadMsg() {
    this.msgs= [];
    this.users= [];
    this.rooms= [];
    this.nickNames= [];
    await this._services.getListMsgGroup(this._services.user.msg, this.listMsg.length, this._services.user._id)
    .then( respone => {
       if(respone.listMsg.length == 0) return;
       this.msgs= respone.listMsg;
       this.users= respone.user;
       this.rooms= respone.room;
       this.nickNames= respone.nickname;
    } )
    .catch( err => console.log(err.message));
    if(this.msgs.length== 0 ) return;
    this.msgs.forEach( msg => {  
        const amsg= this.getUser(msg.idsend);
        msg.name = amsg.name;
        msg.urlImg= amsg.urlImg;
        
        msg.nickname= this.getNickName(msg.roomname, msg.idsend);
      //  if(msg.nickname== 'null') msg.nickname= msg.name;
        const aroom= this.getRoom(msg.roomname);
        msg.room= aroom.name;
        msg.color= aroom.color;
        msg.type= aroom.type;
        if(aroom.type== 'group') msg.urlImg= aroom.urlImg;
        msg.listNameUser= this.getId2InAroom(msg.roomname, msg.idsend);  
    })
    this.listMsg= this.listMsg.concat(this.msgs);
  }

  getId2InAroom(idroom: string, iduser: string): objUser[]  { // lat id con lai cua phong
    let obuser: objUser[]= [];
    this.nickNames.forEach( anickname => {
      if(anickname.nameroom== idroom && anickname.iduser != iduser) {
        const auser= this.getUser(anickname.iduser);
        
  
        // if(!auser) return;
        obuser.push({id: anickname.iduser, name: auser.name, nickname: anickname.name, seen: anickname.seen})
      }
    })
    return obuser;
      
   }
  
   getUser(id: string): listAccept {
    let user: listAccept;
    this.users.forEach(  auser => {
      if(auser._id== id) {
         user= auser;
         return;
      }
    })
    return user;
  }
  
    getRoom(idroom: string): room {
      let aroom: room;
      this.rooms.forEach( room => {
        if(room.idroom== idroom) return aroom= room;
      })
      return aroom;
    }
  
    getNickName(idroom: string, iduser: string) : string {
      let anickname=''
      this.nickNames.forEach( nickname => {
        if(nickname.nameroom== idroom && nickname.iduser== iduser) return anickname= nickname.name;
      })
      return anickname;
    }

  

    async loadData(event) {
    
      if(this.arrSendMsg.length > 0) {
        event.target.complete();
        return;
      }
      if(this.listMsg.length== this._services.user.msg.length ){
        // event.target.disabled= true;// chi cho lan sau nen phai return
        event.target.complete();
        return;
        }
      await this.loadMsg();
      event.target.complete();
    }


}
