import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { FormControl } from '@angular/forms';
import { ChatServicesService } from '../Services/chat-services.service';
import { listAccept, room, nickName, message, handelNickName, msg, objUser } from '../../model/interface';
import { IonContent, IonInfiniteScroll, PopoverController } from '@ionic/angular'; 
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingRoomComponent } from './setting-room/setting-room.component';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-msg',
  templateUrl: './msg.page.html',
  styleUrls: ['./msg.page.scss'],
})
export class MsgPage implements OnInit {

  msg: string = " ";
  x = 0;
  id = '';
  messages: message[] = [];
  isdisabled = false;
  isdisabledevent = false;
  newMsg=''
   @ViewChild(IonContent, {static: false}) content: IonContent; 
   @ViewChild(IonInfiniteScroll, { static: false}) infiniteScroll: IonInfiniteScroll;
  users: listAccept[] = [];
  msgs: message[] = [];
  rooms: room;
  nickNames: nickName[] = [];
  listNameUser: objUser[] = [];
  listAllNickName: handelNickName[] = [];

  listMsg: message[] = [];
  timeSeen = 0;
  check = false; 
  listDelete = []; 


  constructor(private _services: ChatServicesService, private activeRouter: ActivatedRoute, private router: Router, public popoverController: PopoverController
    , private loadingController: LoadingController) {

     this._services.socket.on('Server-send-change-nickName', data => {
       this.listNameUser.forEach( docs => {
         if(docs.id == data.iduser) docs.nickname = data.nickname;
       });
       this.listAllNickName.forEach( docs => {
         if(docs.id == data.iduser) docs.nickname = data.nickname;
       })
     });

     this._services.socket.on('Server-send-addMember', (data: msg) => {
        if(data.roomname != this.id || this.check) return;
        this.messages.push(data);
        setTimeout( () => {
          this.content.scrollToBottom(200);
        })
     });

    this._services.socket.on('Server-send-message', (message: msg) => {

      if(!this.check && this.id != message.roomname){
        this._services.presentToastWithOptions(message);
      };
      if(message.roomname != this.id || this.check) return;
      //if(this.check) return;
      const index= this._services.user.block.findIndex( docs => {
        return docs == message.roomname;
      });
      if(index != -1) return;
     // this._services.socket.emit('Client-send-seen-msg', { iduser: this._services.user._id, idroom: this.id, time: +new Date().getTime() });
      this.messages.push(message);
      setTimeout( () => {
        this.content.scrollToBottom(200)
      })
    }); 

    this._services.socket.on('Server-send-amsg', (message: msg) => {
      if(message.roomname != this.id || this.check) return;
      const index= this._services.user.block.findIndex( docs => {
        return docs == message.roomname;
      });
      if(index != -1) return;
     
      this._services.socket.emit('Client-send-seen-msg', { iduser: this._services.user._id, idroom: this.id, time: +new Date().getTime() });
    })

    this._services.socket.on('Server-send-updateTime', message => {
      this.messages.forEach( amsg => {
        // { _id: amsg._id, creatednew: obj.created, createdold: message.created };
        if(amsg._id == message.createdold && amsg.idsend == message.idsend){
          amsg._id= message._id;
          amsg.created= message.creatednew;
          return;
        }
      })
    });

    this._services.socket.on('Server-send-deleteAllmsg', async data => {
      if(this.id == data.idroom){
        this.isdisabledevent= true;
        this.messages = []; 
        await setTimeout( () => {
          this.content.scrollToTop(200)
        });
      }
    })

    this._services.socket.on('Server-send-seen-msg', data => {
      if(data.idroom != this.id) return;
      if(this._services.user._id == data.iduser) {
        this.timeSeen == data.time;
        return;
      }
      this.listNameUser.forEach( docs => {
        if(docs.id == data.iduser) docs.seen = +data.time;
      });
      setTimeout( () => {
        this.content.scrollToBottom(200);
      })
    })

    this._services.socket.on('Client-send-updatemsg-delete', data => {
      if(this.id != data.idroom) return;
      const index= this.messages.findIndex( docs => {
        return docs._id == data.iddlt;
      });
      if(index == -1) return;
      if(data.res.index == 2) this.isdisabled = true;
      this.messages.splice(index, 1)
    });

    this._services.socket.on('Server-send-deleteAllmsg-inRoom', async data => {
      if(this.rooms.idroom != data.idroom) return;
      this.isdisabledevent = true;
        this.messages = []; 
        await setTimeout( () => {
          this.content.scrollToTop(200)
        });
    });

    this._services.socket.on('Server-send-blocked-room-alluser', data => {
      if(this.id != data.idroom) return;
      this.rooms.countBlock++;
    });

    this._services.socket.on('Server-send-unblock-room-alluser', data => {
      if(this.id != data.idroom || this._services.user._id == data.iduser) return;
      this.rooms.countBlock--;
    });

    this._services.socket.on('Server-send-unblock-room', data => {
      if(data.idroom != this.id) return;
      this.rooms.countBlock--;
    })

   }

 async ngOnInit() {
    this.activeRouter.paramMap.subscribe( pramap =>{
      if(!pramap.has('roomName')) return;
      this.id = pramap.get('roomName');
    });    
     //this.loadDing();
    await this.loadMsginRoom();
    this.getListObj();
    const index = this._services.user.block.findIndex( docs => {
      return docs == this.id;
    });
    if(index == -1) {
    this._services.socket.emit('Client-send-seen-msg', 
      { iduser: this._services.user._id, idroom: this.id, time: +new Date().getTime() });
    }
    this.isdisabled = true;
    await setTimeout( () => {
      this.content.scrollToBottom(200);
    });
  }

  getSeen() :{ isseen: boolean, status: string} {
    if(this.messages.length== 0 ) return { isseen: false, status: ''};
    let arrSeen: Array<{_id: string, name: string} >= [];
    let status = '';
    let count = 0;
    let isssen: boolean = false;
    if(this.rooms.type == 'arrom'){
     if(this.listNameUser[0].seen >= this.messages[this.messages.length-1].created) return { isseen: true, status: 'da xem'};
     return { isseen: false, status: 'chua xem'};
    }

    this.listNameUser.forEach( nameuser => {
      if(nameuser.seen >= this.messages[this.messages.length-1].created && nameuser.id != this._services.user._id && this.messages[this.messages.length-1].idsend != nameuser.id) {
        arrSeen.push({_id: nameuser.id, name:  nameuser.nickname=='nulls'? nameuser.name : nameuser.nickname })
      };
      if(nameuser.seen >= this.messages[this.messages.length-1].created && nameuser.id == this._services.user._id ) isssen= true;
    }); 
    //if( !arrSeen) return { isseen: false, status: ''};// cai nay nes
    if(arrSeen.length == 0 ) return { isseen: isssen, status: 'chi co  minh ban xem'};
    if(arrSeen.length <= 3) {//
      arrSeen.forEach( docs => {
          if(status == '') {
            status= docs.name;
            return;
          }
          status += `, ${docs.name}`
      })
      return { isseen: true, status: status};
    }

    arrSeen.forEach( docs => {
        if(status == '') {
          status= docs.name;
          count++;
          return;
        }
        if(count == 3){
          status += `and ${arrSeen.length-3} more`;
          return;
        }
        if(count > 3) return;
        status += `, ${docs.name}`;
        count++;
      // }
    })

    return { isseen: true, status: status}
  }

  isSeenMySendMsg(): { isseen: boolean, status: string }{
    if(this.messages.length == 0 ) return { isseen: false, status: 'k co tin nhan'};
    let arrSeen: Array<{_id: string, name: string}>= [];
    let person = 0;
    let status = '';
    let count = 0;
    if(this.rooms.type== 'aroom'){
      if(this.listNameUser[0].seen >= this.messages[this.messages.length-1].created) return { isseen: true, status: 'da xem'};
      return {isseen: false, status: 'chua xem'};
    }
    this.listNameUser.forEach( nameuser => {
      if(nameuser.seen >= this.messages[this.messages.length-1].created) {
        arrSeen.push({_id: nameuser.id, name:  nameuser.nickname =='nulls'? nameuser.name : nameuser.nickname })
      }
    });
    if(arrSeen.length == 0 ) return { isseen: false, status: ''};
    arrSeen.forEach( docs => {
      const index= this._services.user.friends.findIndex( idfd => {return idfd == docs._id});
      if(index != -1) person++;
    });
    if(arrSeen.length <= 3) {//
      arrSeen.forEach( docs => {
          if(status == '') {
            status = docs.name;
            return;
          }
          status += `, ${docs.name}`
        // }
      })
      return { isseen: true, status: status};
    }

    arrSeen.forEach( docs => {
        if(status == '') {
          status= docs.name;
          count++;
          return;
        }
        if(count == 3){
          status += `and ${arrSeen.length-3} more`;
          return;
        }
        if(count >3) return;
        status += `, ${docs.name}`;
        count++;
    })

    return { isseen: true, status: status}

  }

  async loadDing(){
    const loading = await this.loadingController.create({
      message: 'Loading cities...'
    });
    await loading.present();
  }
  

  isBlock(){
  //  console.log(this.rooms)
    if(!this.rooms) return true;
    const index= this._services.user.block.findIndex( docs => {
      return docs == this.id;
    });
    if(index!= -1) return true; // co trong ds chan cua minh
    if(this.rooms.type == 'aroom' && this.rooms.countBlock > 0) return true;
    return false;
  }

  async presentPoper(ev) {
    const poper= await this.popoverController.create({
      component: SettingRoomComponent,
      componentProps: {
        'room': this.rooms,
        'idMsgEnd': this.messages[this.messages.length-1]._id,
        'idroom': this.id,
        'listNameUser': this.listNameUser,
        'listAllNickName': this.listAllNickName,
      },
      event: ev,
      mode: 'ios',
      translucent: true
     
    });
    return await poper.present();
  }

  isDeleting(idmsg: string): boolean {
    const index= this.listDelete.findIndex( docs => {return docs== idmsg});
    if(index == -1) return false;
    return true;
  }

  async onDeleteAmsg(idmsg: string) {
    this.listDelete.push(idmsg);
    const obj = { idroom: this.id, iduser: this._services.user._id, idmsg: idmsg  };
    await this._services.deleteAmsg(obj)
    .then( res => {
 
      if(res.index == 1) {
        const index = this.messages.findIndex( message => {
          return message._id == idmsg;
        })
        if(index == -1) return;
        this.messages.splice(index, 1)
        return;
      }
      this._services.socket.emit('Server-send-updatemsg-delete', { iduser: this._services.user._id, res: res, iddlt: idmsg, idroom: this.id });
    })
    .catch( err => console.log(err.message))
    const index = this.listDelete.findIndex( docs =>{ return docs == idmsg});
    if(index == -1) return;
    this.listDelete.splice(index, 1);
  }

  onBack(){
    this.check = true;
  }

  isMySendMsg(): { checkRow: boolean, checkCol: boolean} {
    if(this.messages.length == 0) return { checkRow: false, checkCol: false};
    if(this.messages[this.messages.length-1].idsend != this._services.user._id ) {
      return { checkRow: true, checkCol: false}
    }
    return { checkRow: true, checkCol: true};
  }

  async loadMsginRoom() {
   
    this.msgs = [];
    this.users = [];
    await this._services.getMessageinRoom(this.id, this.messages.length, this._services.user._id)
    .then( respone => {
      //  if(respone.listMsg.length == 0) return;
       this.msgs = respone.listMsg;
       this.users = respone.user;

       this.rooms = respone.room;
       this.nickNames = respone.nickname;
    } )
    .catch( err => console.log(err.message));
   // if(this.msgs.length < 10) this.isdisabled= true;
    if(this.msgs.length == 0 ) {
      this.isdisabledevent = true;
      // this.isdisabled= true;
      return;
    }
    
    this.getListObj();

    this.msgs.forEach( msg => {  
        const amsg = this.getUser(msg.idsend);
        msg.name = amsg.name;
        msg.urlImg = amsg.urlImg;
        msg.nickname = this.getNickName( msg.idsend);
    })

    this.msgs = this.msgs.reverse();
    this.messages = this.msgs.concat(this.messages);


    //this.messages= (this.messages.concat(this.msgs)).reverse();
  }

  getListObj() {
    this.listNameUser = [];
    this.listAllNickName = [];

    this.nickNames.forEach( anickname => {
      this.users.forEach( auser => {

        if(anickname.iduser == auser._id){
          this.listAllNickName.push({ id: auser._id, name: auser.name, nickname: anickname.name, urlImg: auser.urlImg});
        }
        if(anickname.iduser == auser._id && auser._id != this._services.user._id){
          this.listNameUser.push({ id: auser._id, name: auser.name, nickname: anickname.name, seen: anickname.seen });
        }
      })
    })

  }

  getNickName( iduser: string) : string {
    let anickname = '';
    this.nickNames.forEach( nickname => {
      if( nickname.iduser == iduser) {
        anickname = nickname.name;
        return;
      } 
    })
    return anickname;
  }

  getUser(id: string): listAccept {
    let user: listAccept;
    this.users.forEach(  auser => {
      if(auser._id == id) return user = auser;
    })
    return user;
  }

  sendMessage(){
    const amessage = { 
    _id: new Date().getTime()+'',
    idsend: this._services.user._id,
    seen: false,
    msg: this.newMsg.trim(),
    created: new Date().getTime(),
    roomname: this.id,
    name: this._services.user.name,

    urlImg:  this.rooms.type== 'aroom'? this._services.user.urlImg: this.rooms.urlImg ,
        nickname: this.getNickName(this._services.user._id),
    room: this.rooms.name,
    color: this.rooms.color,
    type: this.rooms.type,


    listNameUser: this.listNameUser
  }
  this.messages.push(amessage);
  this._services.socket.emit('Client-send-messages', amessage );

  this.newMsg = '';
  setTimeout( () => {
    this.content.scrollToBottom(200)
  })
}

  handleName(message: message): string {
    if(message.nickname == 'nulls') return message.name;
    return message.nickname;
  } 

  async loadData(event) { 
    if(this.isdisabledevent) {
      event.target.disabled = true;// chi cho lan sau nen phai return
      event.target.complete();
      return;
    }

    if(this.isdisabled) {
     // event.target.disabled = true;
      this.isdisabled = false;
      event.target.complete();
      return
    }
    await this.loadMsginRoom();
    if(this.isdisabled) {
    // event.target.disabled = true;
    this.isdisabled = false;
    event.target.complete();
    return;
  }
  // if(this.messages.length <= 20) {
  //   await setTimeout( () => {
  //     this.content.scrollToBottom(200)
  //   })
  // }

  event.target.complete();

  }

  sendMsg() {
     this._services.setMsg(this.msg);
  }
  // updateSmg() {
  //   setInterval( () => {
  //     this.msgg= this._services.msg;
  //     const x="vuongvuong"
  //     if(this._services.send){   
  //       $("#list").append( "<ion-item>" + x +  "</ion-item>" )
  //       this._services.send= false;
  //     }
  //   } ,100)
    
  // }

}
