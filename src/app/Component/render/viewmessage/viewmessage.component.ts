import { Component, OnInit } from '@angular/core';

import { ChatServicesService } from '../../Services/chat-services.service';
import { listAccept, nickName, room, User, msg, objUser } from '../../../model/interface';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-viewmessage',
  templateUrl: './viewmessage.component.html',
  styleUrls: ['./viewmessage.component.scss'],
})
export class ViewmessageComponent implements OnInit {

  users: listAccept[] = [];
  rooms: room[] = [];
  nickNames: nickName[] = [];

  msgs: msg[] = [];
  listMsg: msg[] = [];
  arrSendMsg = [];

  constructor(private _services: ChatServicesService, private alertCtrl: AlertController) {


    this._services.socket.on('Server-send-leave-room', data => {

      // if(this._services.user._id != data.iduser) return;
      const index= this.listMsg.findIndex( docs => {
        return docs.roomname == data.idroom;
      });
      if(index != -1) this.listMsg.splice(index, 1);

    })

    this._services.socket.on('Server-send-change-nickName', data => {

      this.listMsg.forEach( docs => {
        if(docs.roomname == data.idroom){
          if(docs.idsend == data.iduser) {
            docs.nickname = data.nickname;
            return;
          }
          docs.listNameUser.forEach( docs => {
            if(docs.id == data.iduser) docs.nickname= data.nickname;
          })
        }
      })
    });

    this._services.socket.on('Server-send-amsg', (msg: msg) => {
      this.arrSendMsg.push(1);
    
      const indexs= this._services.user.block.findIndex( docs => {
        return docs == msg.roomname;
      })
      if(indexs != -1) return;
        const index= this.listMsg.findIndex( amsg =>{
          // return JSON.stringify(amsg) == JSON.stringify(msg);
          return amsg.roomname== msg.roomname;
        });
       if(index != -1) { 
         this.listMsg.splice(index, 1);
       }
       this.listMsg.splice(0, 0, msg);
       this.arrSendMsg.splice(1, 0);

    });

    this._services.socket.on('Server-send-updateTime', (message) => {

      this.listMsg.forEach( amsg => {
        // { _id: amsg._id, creatednew: obj.created, createdold: message.created };
        if(amsg._id== message._id){
          // amsg._id= message._id;
          amsg.created= message.creatednew;
      
        }
      })
    })

    this._services.socket.on('Server-send-deleteAllmsg', data => {

      const index= this.listMsg.findIndex( msg => {
        return msg.roomname== data.idroom;
      })
      if(index == -1) return;
      this.listMsg.splice(index, 1);
    });

    this._services.socket.on('Server-send-hide-room', data =>{

      const index= this._services.user.hidemsg.findIndex( docs => {
        return docs== data.idmsg;
      });
      if(index != -1) return;
      this._services.user.hidemsg.push(data.idmsg);
    });

    this._services.socket.on('Server-send-show-room', data => {

      const index= this._services.user.hidemsg.findIndex( docs => { return docs== data.idmsg });
      if(index== -1) return;
      this._services.user.hidemsg.splice(index, 1);
    })

    this._services.socket.on('My-update-seen-msg', data => {

      this.listMsg.forEach( docs => {
        if(docs.roomname== data.idroom){
          if(docs.idsend == data.iduser) return;
          docs.listNameUser.forEach( docss => {
            if(docss.id== data.iduser) docss.seen= data.time;
          })
        }
      })
    })// k su dung

    this._services.socket.on('Server-send-seen-msg', data => {

      this.listMsg.forEach( docs => {
        if(docs.roomname== data.idroom){
          if(docs.idsend == data.iduser) return;
    
          docs.listNameUser.forEach( docss => {
            if(docss.id== data.iduser)  docss.seen= data.time;
          })
        }
      })
    }); 

    this._services.socket.on('Client-send-updatemsg-delete', data => {

     if(data.res.index== 1) return;
     if(data.res.index == 2) {
       const index= this.listMsg.findIndex( msg => {
         return msg.roomname== data.idroom;
       });

       if(index == -1) return;
       this.listMsg.splice(index, 1);
       return;
     }
      this.listMsg.forEach( msg => {
        if(msg.roomname == data.res.message.roomname) {
          msg._id= data.res.message._id;
          msg.seen= data.res.message.seen;
          msg.msg= data.res.message.msg;
          msg.created= data.res.message.created;
          msg.idsend= data.res.message.idsend;
        }
      })
    });

    this._services.socket.on('Server-send-createdGroup', (data: msg) => {

      const index= this.listMsg.findIndex( docs => { return docs.roomname== data.roomname});
      if(index != -1) return
      this.listMsg.splice(0, 0, data)
    }); 

    this._services.socket.on('Server-send-deleteAllmsg-inRoom', data => {

     const index = this.listMsg.findIndex( docs =>{ return docs.roomname== data.idroom});
     if(index == -1) return;
     this.listMsg.splice(index, 1);
    });

    this._services.socket.on('Server-send-addMember', (data: msg) => {

      const index = this.listMsg.findIndex( docs => {
        return docs.roomname == data.roomname;
      });
      if(index != -1) this.listMsg.splice(index, 1);
      this.listMsg.splice(0, 0, data);
    })

   }

  async ngOnInit() {
   await this.loadMsg();

  } 

  ////

  unBlockRoom(idroom: string) {
    const obj= { iduser: this._services.user._id, idroom: idroom };
    this._services.managementRoom(obj, 'https://vuongdeptrai.herokuapp.com/user/unblock-room')
    .then( res => {
      this._services.user.room.push(idroom);
      const index= this._services.user.block.findIndex( docs => {
        return docs== idroom;
      });
      if(index != -1) this._services.user.block.splice(index, 1);
      this._services.socket.emit('Client-send-unblock-room', obj)
    })
  }

  blockRoom(idroom: string){
    // this._services.user.block.push(this.idroom);    
    const obj= { iduser: this._services.user._id, idroom: idroom };
    this._services.managementRoom(obj, 'https://vuongdeptrai.herokuapp.com/user/block-room')
    .then( res => { 
      this._services.user.block.push(idroom);
      const indexs= this._services.user.room.findIndex( docs => {
        return docs== idroom;
      });
      if(indexs != -1) this._services.user.room.splice(indexs, 1)
      this._services.socket.emit('Client-send-blocked-room', obj)
    })
    .catch( err => {
      console.log(err.message);
      // const index= this._services.user.block.findIndex( docs => {
      //   return docs== this.idroom;
      // });
      // if(index== -1) return;
      // this._services.user.block.splice(index, 1);
      
    })
  }

  isBlocked(idroom: string): boolean {
    const index= this._services.user.block.findIndex( docs => {
      return docs== idroom;
    });
    if(index== -1) return false;
    return true;
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

  getSeen(msg:msg) :{ isseen: boolean, status: string} {
    let arrSeen: Array<{_id: string, name: string}>= [];
    let status= '';
    let count= 0;
    let isssen: boolean= false;
    if(msg.type== 'arrom'){
     if(msg.listNameUser[0].seen >= msg.created) return { isseen: true, status: 'hien icon da xem'};
     return { isseen: false, status: 'hien icon chua  xem'};
    }

    msg.listNameUser.forEach( nameuser => {
      if(nameuser.seen >= msg.created && nameuser.id != this._services.user._id) {
        arrSeen.push({_id: nameuser.id, name:  nameuser.nickname=='nulls'? nameuser.name : nameuser.nickname })
      };
      if(nameuser.seen >= msg.created && nameuser.id == this._services.user._id) isssen= true;
    });
    //if( !arrSeen) return { isseen: false, status: ''};// cai nay nes
    if(arrSeen.length== 0 ) return { isseen: isssen, status: 'hien icon chua xem'+ isssen};
    // arrSeen.forEach( docs => {
    //   const index= this._services.user.friends.findIndex( idfd => {return idfd== docs._id});
    //   if(index != -1) 
    // });
    if(arrSeen.length <= 3) {//
      arrSeen.forEach( docs => {
        
        // const index= this._services.user.friends.findIndex( idfd => {return idfd== docs._id});
        // if(index != -1) {

          if(status == '') {
            status= docs.name;
            return;
          }
          status += `, ${docs.name}`
        // }
      })
      return { isseen: true, status: status};
    }

    arrSeen.forEach( docs => {
      // const index= this._services.user.friends.findIndex( idfd => {return idfd== docs._id});
      // if(index != -1) {
        if(status == '') {
          status= docs.name;
          count++;
          return;
        }
        if(count== 3){
          status += `and ${arrSeen.length-3} more`;
          return;
        }
        if(count >3) return;
        status += `, ${docs.name}`;
        count++;
      // }
    })

    return { isseen: true, status: status}

    
    //msg.listNameUser.forEach( docs => {
    //   if(docs.id == this._services.user._id) {
    //     if(docs.seen >= msg.created) {
    //       str= ' chu da xem';
    //       return
    //     }
    //     str= ' chua chua xem' 
    //   }
    // })
    // return str;
  }

  isSeenMySendMsg(msg: msg): { isseen: boolean, status: string }{
    let arrSeen: Array<{_id: string, name: string}>= [];
    let person= 0;
    let status= '';
    let count= 0;
    if(msg.type== 'aroom'){
      if(msg.listNameUser[0].seen >= msg.created) return { isseen: true, status: 'icon da xem'};
      return {isseen: false, status: 'icon chua xem'};
    }
    msg.listNameUser.forEach( nameuser => {
      if(nameuser.seen >= msg.created) {
        arrSeen.push({_id: nameuser.id, name:  nameuser.nickname=='nulls'? nameuser.name : nameuser.nickname })
      }
    });
    //if( !arrSeen) return { isseen: false, status: ''};// cai nay nes
    if(arrSeen.length== 0 ) return { isseen: false, status: ''};
    arrSeen.forEach( docs => {
      const index= this._services.user.friends.findIndex( idfd => {return idfd== docs._id});
      if(index != -1) person++;
    });
    if(arrSeen.length <= 3) {//
      arrSeen.forEach( docs => {
        
        // const index= this._services.user.friends.findIndex( idfd => {return idfd== docs._id});
        // if(index != -1) {
          if(status == '') {
            status= docs.name;
            return;
          }
          status += `, ${docs.name}`
        // }
      })
      return { isseen: true, status: status};
    }

    arrSeen.forEach( docs => {
      // const index= this._services.user.friends.findIndex( idfd => {return idfd== docs._id});
      // if(index != -1) {
        if(status == '') {
          status= docs.name;
          count++;
          return;
        }
        if(count== 3){
          status += `and ${arrSeen.length-3} more`;
          return;
        }
        if(count >3) return;
        status += `, ${docs.name}`;
        count++;
      // }
    })

    return { isseen: true, status: status}

  }

  isHideMsg(idmsg: string) {
    const index= this._services.user.hidemsg.findIndex( docs => {
      return docs== idmsg;
  });
  if(index== -1) return false;
  return true;
  }

  isDissmissNotification(idroom: string): boolean {
    const index= this._services.user.dismissroom.findIndex( docs => {
      return docs== idroom;
    });
    if(index== -1) return false;
    return true;
  }

  dismissNotification(idroom: string) {
    const index= this._services.user.dismissroom.findIndex( docs => {
      return docs== idroom;
    })
    if(index != -1) return;
    const obj= { idroom: idroom, iduser: this._services.user._id };
    //this._services.socket.emit('Client-send-dismiss-room', obj);
    // this._services.socket.emit('Client-send-dismiss-room', obj)
    this._services.user.dismissroom.push(idroom);
    this._services.managementRoom(obj, 'https://vuongdeptrai.herokuapp.com/user/dismiss-room')
    .then( res => { this._services.socket.emit('Client-send-dismiss-room', obj);})
    .catch( err => {
      const index= this._services.user.dismissroom.findIndex( dosc => {
        return dosc== idroom;
      });
      if(index == -1) return;
      this._services.user.dismissroom.splice(index, 1);
      console.log(err);
    })
  }

  missNotification(idroom: string) {
    const index= this._services.user.dismissroom.findIndex( docs => {
      return docs== idroom;
    });
    if(index== -1) return;
    const obj= { idroom: idroom, iduser: this._services.user._id};
    // this._services.socket.emit('Client-send-miss-room', obj);
    this._services.user.dismissroom.splice( index, 1);
    this._services.managementRoom(obj, 'https://vuongdeptrai.herokuapp.com/user/miss-room')
    .then( res => { this._services.socket.emit('Client-send-miss-room', obj)} )
    .catch( err => {
      const index= this._services.user.dismissroom.findIndex( dosc => {
        return dosc== idroom;
      });
      if(index != -1) return;
      this._services.user.dismissroom.push(idroom);
      console.log(err);
    })

  }

  hideRoom(idmsg: string) {// an tin nhan
    const index= this._services.user.hidemsg.findIndex( docs => {
      return docs== idmsg;
    });
    if(index != -1) return;
    this._services.user.hidemsg.push(idmsg);
    const obj= { idmsg: idmsg, iduser: this._services.user._id };
    // this._services.socket.emit('Client-send-hide-room', obj)
    this._services.managementRoom(obj, 'https://vuongdeptrai.herokuapp.com/user/hide-room')
    .then( res => {this._services.socket.emit('Client-send-hide-room', obj)})
    .catch( err => {
      const index= this._services.user.hidemsg.findIndex( dosc => {
        return dosc== idmsg;
      });
      if(index == -1) return;
      this._services.user.hidemsg.splice(index, 1);
      console.log(err);
    })
  }

  deleteMessagesinRoom(msg: msg, index: number) {
    // this.listMsg.splice(index, 1);
    this._services.user.hidemsg.push(msg.roomname);
    let indexs= -1
 
    const obj= { idroom: msg.roomname, iduser: this._services.user._id, time: + new Date().getTime(), idmsg: msg._id}
    this._services.deleteAllMsg(obj)
    .then( res => { 
      this._services.socket.emit('Client-send-deleteAllmsg', obj);
      const index= this.listMsg.findIndex( msg => {
        return msg.roomname== msg.roomname
      })
      if(index == -1) return;
      this.listMsg.splice(index, 1);
      
      indexs=this._services.user.hidemsg.findIndex( hide => {
        return hide== msg.roomname;
      });
      if(indexs== -1) return;
      this._services.user.hidemsg.splice(indexs, 1)
    })
    .catch( err =>{ 
      indexs= this._services.user.hidemsg.findIndex( hide => {
        return hide== msg.roomname;
      });
      if(indexs== -1) return;
      this._services.user.hidemsg.splice(indexs, 1)
      console.log(err)
    });

  }

  createRoom(myid: string, idsend: string): string {
    const compare= myid.localeCompare(idsend);
     if( compare> 0) return  myid+ idsend;
     return  idsend+ myid 
  }

  async loadMsg() {
    this.msgs= [];
    this.users= [];
    this.rooms= [];
    this.nickNames= [];
    await this._services.getListMsg(this._services.user.msg, this.listMsg.length, this._services.user._id)
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

  handleMsg(msg: msg): string {
    if(msg.idsend == this._services.user._id) return `Bạn: ${msg.msg}`;
    if(msg.nickname == 'nulls') return `${msg.name}: ${msg.msg}`;
    return `${msg.nickname}: ${msg.msg}`; 
  }

  handleNameRoom(msg: msg) :string {
    if(msg.room == 'nulls'){
      if(msg.idsend== this._services.user._id){
        if (msg.listNameUser[0].nickname== 'nulls') return msg.listNameUser[0].name;
          return msg.listNameUser[0].nickname; 
      }
        if(msg.nickname== 'nulls') return msg.name
          return msg.nickname;  
    }
    return msg.room;

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
      event.target.disabled= true;// chi cho lan sau nen phai return
      event.target.complete();
      return;
      }
    await this.loadMsg();
    event.target.complete();
  }

}
