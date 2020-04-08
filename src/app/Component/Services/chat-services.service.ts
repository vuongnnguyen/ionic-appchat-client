import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../login/login.page';
import * as io from 'socket.io-client';
import { MsgPage, message } from '../msg/msg.page';
import { Notifican } from '../notification/notification.page';
import { friendAccept } from '../invite-friend/invite-friend.page';
import { msg } from '../render/viewmessage/viewmessage.component';

export interface listAccept{
  _id: string;
  name: string;
  urlImg: string;
}



export interface nickName {
  iduser: string;
  name: string;
  nameroom: string;
  seen: number;
  created: number;
}
// iduser: { type: String},
// name: { type: String, default: 'null'},
// nameroom: { type: String},
// created: { type: Number}
export interface room {
  idroom: string;
  name: string;
  color: string;
  type: string;
  created: number;
  urlImg: string;
  countBlock: number;
}
// name: { type: String},
// color: { type: String, default: 'blue'},
// type: { type: String},
// created: { type: Number}

export interface objMsgUser{
  user: Array<listAccept>;
  listMsg: Array<msg>;
  room: Array<room>;
  nickname: Array<nickName>;
}
export interface objMessage{
  user: Array<listAccept>;
  listMsg: Array<msg>;
  room: room;
  nickname: Array<nickName>;
}

export interface userSeach{
  _id: string;
  urlImg: string;
  name: string;
  userName: string;
}
 
@Injectable({
  providedIn: 'root'
})
export class ChatServicesService {
  public socket: SocketIOClient.Socket;
  user: User;
  msg= '';
  send= false;
  seach= "";
  checkSeach= false;
  // listLoading= [];




  constructor( private http: HttpClient) {
    console.log('day la contrusctor')
    this.socket = io('http://localhost:3000');
    this.socket.on("Server-send-chat", data => {
      // $("#tn").text(data);
      // this.setMsg(data);
    });
    this.socket.on("Server-send-amsg", (msg: msg) => {
      const index=this.user.msg.findIndex( amsg => {
        return msg._id== amsg;
      });
      if(index != -1) this.user.msg.splice(index, 1);
      this.user.msg.push(msg._id);
    });
    this.socket.on('Server-send-ReloadUser', datta => {
      this.reloadUser(this.user._id)
      .then( respone => this.user= respone);
    })

    this.socket.on('Server-waitAddFriends', user => {
      console.log('da vao ben trong services')
       // this.listFriends.splice(0, 0, user);
        // this.user.waitaccept.push(user);
        this.user.friendaccepts.push(user._id)

    })

    this.socket.on('Server-notifiAddFr', (noti: Notifican) =>{
      this.user.notification.push(noti._id);
    });

    this.socket.on('Server-addFriend', room => {
      this.socket.emit('Client-join-room', [room.nameroom])
      this.user.friends.push(room.idfd);
      this.user.room.push(room.nameroom);
    })


    this.socket.on('Server-send-dismiss-room', data => {
      const index= this.user.dismissroom.findIndex( docs => {
        return docs== data.idroom;
      });
      if(index != -1) return;
      this.user.dismissroom.push(data.idroom);
    });

    this.socket.on('Server-send-err-dismiss-room', data => {
      const index= this.user.dismissroom.findIndex( docs => {
        return docs== data.idroom;
      });
      if(index == -1) return;
      this.user.dismissroom.splice(index, 1);
    })

    this.socket.on('Server-send-miss-room', data => {
      const index= this.user.dismissroom.findIndex( docs => {
        return docs== data.idroom;
      });
      if(index == -1) return;
      this.user.dismissroom.splice(index, 1)
    });

    this.socket.on('Server-send-err-miss-room', data => {
      const index= this.user.dismissroom.findIndex( docs => {
        return docs== data.idroom;
      });
      if(index != -1) return;
      this.user.dismissroom.push(data.idroom)
    });
   
    this.socket.on('Server-send-hide-room', data => {
      const index= this.user.hidemsg.findIndex( docs =>{
        return docs== data.idmsg;
      });
      if(index != -1) return;
      this.user.hidemsg.push(data.idmsg)
    });

    this.socket.on('Server-send-err-hide-room', data => {
      const index= this.user.hidemsg.findIndex( docs =>{
        return docs== data.idmsg;
      });
      if(index == -1) return;
      this.user.hidemsg.splice(index, 1);
    })
    
    this.socket.on('Server-send-createdGroup', (data: msg) => {
      this.socket.emit('Client-join-room', [data.roomname])
      const index1= this.user.room.findIndex( docs => { return docs== data.roomname});
      if(index1 != -1) this.user.room.push(data.roomname);
      const index2= this.user.msg.findIndex( docs => { return docs== data._id});
      if(index2== -1) return;
      this.user.msg.push(data._id);
    });

    this.socket.on('Server-send-blocked-room', data => {
      const index= this.user.block.findIndex( docs => {
        return docs== data.idroom;
      });
      if(index ==-1) this.user.block.push(data.idroom);
      const indexs= this.user.room.findIndex( docs => {
        return docs== data.idroom;
      });
      if(indexs == -1) return;
      this.user.room.splice(indexs, 1)
    });
    
    this.socket.on('Server-send-unblock-room', data => {
      this.socket.emit('Client-join-room', [ data.idroom])
      const index= this.user.block.findIndex( docs => {
        return docs== data.idroom;
      });
      if(index!= -1) this.user.block.splice(index, 1);
      const indexs= this.user.room.findIndex( docs => {
        return docs== data.idroom;
      });
      if(indexs== -1) this.user.room.push(data.idroom);
    });

    this.socket.on('Server-send-join-room', data => {
      this.user.room.push(data.idroom);
      this.socket.emit('Client-join-room', [data.idroom])
    });

    this.socket.on('Server-send-leave-room', data => {
      this.socket.emit('Client-send-leave', data.idroom )
    })


    // this.socket.on('Server-send-kecmm', (msg) => {
    //   console.log('9999999999999999999999999999999')
    // })


    // this.socket.on("test-thu", data =>{
    //   console.log(data);
    // })


    // this.socket.on('Server-notifiAddFr', notifican => {
    //   console.log('day la' + notifican)
    // })
   }

   addMember(obj): Promise<msg> {
    const url= 'http://localhost:3000/user/add-member';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(obj);
    return this.http.post<msg>(url, body, httpOptions ).toPromise()
    .then( res => res)
    .catch( err => {
      console.log(err.message)
       throw err})
 }

   seachMember(obj): Promise<userSeach>{
      const url= 'http://localhost:3000/user/seach-member';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'my-auth-token'
        })
      };
      const body= JSON.stringify(obj);
      return this.http.post<userSeach>(url, body, httpOptions ).toPromise()
      .then( res => res)
      .catch( err => { throw err})
   }

   createGroup(obj): Promise<msg> {
     const url= 'http://localhost:3000/user/create-group';
     const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(obj);
    return this.http.post<msg>(url, body, httpOptions ).toPromise()
    .then( res => {
      this.user.room.push(res.roomname);
      this.user.msg.push(res._id);
      this.socket.emit('Client-send-createdGroup', res);
      this.socket.emit('Client-join-room', [res.roomname])
      return res;
    })
    .catch( err => { throw err});
   }

   deleteAmsg(obj): Promise<{index: number, message: msg}> {
    const url= 'http://localhost:3000/user/delete-amsg';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(obj);
    return this.http.post<{index: number, message: msg}>(url, body, httpOptions).toPromise()
    .then( res => res)
    .catch( err => { throw err})
   } 
   
  updateTime(obj) : Promise<boolean> {
    const url= 'http://localhost:3000/user/update-seen-msg';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(obj);
    return this.http.post<boolean>(url, body, httpOptions).toPromise()
    .then( res => res)
    .catch( err => { throw err})
   } 
  
   
  deleteAllMsg(obj): Promise<boolean> {
    const url= 'http://localhost:3000/user/delete-allmsg';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(obj);
    return this.http.post<boolean>(url, body, httpOptions).toPromise()
    .then( res => res)
    .catch( err => { throw err})
   } 
  

  managementRoom(obj, url): Promise<boolean> {
     const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(obj);
    return this.http.post<boolean>(url, body, httpOptions).toPromise()
    .then( res => res)
    .catch( err => { throw err})
   } 

   
  getMessageinRoom(roomname, skip, iduser): Promise<objMessage> {
      const url = 'http://localhost:3000/user/get-messagess';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'my-auth-token'
        })
      };
      const obj= { roomname: roomname, skip: skip, iduser: iduser };
      const body= JSON.stringify(obj);
      return this.http.post<objMessage>( url, body,  httpOptions).toPromise()
      .then( respone => respone)
      .catch( err =>  { throw err })

  }




  upDateUser(obj) {
    const url= 'http://localhost:3000/update-user';
    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      })
    }
    const body= JSON.stringify(obj);
    return this.http.post<boolean>(url, body, httpOptions).toPromise()
    .then( res => res) 
    .catch( err => {throw err})
  }
  

  getListMsg(listmsg: Array<any>, skip: number, myid): Promise<objMsgUser> {
      const url= 'http://localhost:3000/user/getlistmsg';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'my-auth-token'
        })
      };
      const obj= { arrMsg: listmsg, skip: skip, myid: myid };
      const body= JSON.stringify(obj);
      return this.http.post<objMsgUser>( url, body,  httpOptions).toPromise()
      .then( respone => {
        console.log(respone)
        return respone})
      .catch( err =>  { throw err })
  } 


   getListUser(listUser: Array<string>): Promise<listAccept[]>{
    const url= "http://localhost:3000/user/getlistuser";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const obj= { listUser: listUser};
    const body= JSON.stringify(obj);
    return this.http.post<listAccept[]>(url, body, httpOptions).toPromise()
    .then( respone => respone)
    .catch( err => err);
  } 
    
   getListAccept(listAccept: Array<any>, skip): Promise<friendAccept[]> {

    const url= "http://localhost:3000/user/getaccept";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const obj= { arrId: listAccept, skip: skip};
    const body= JSON.stringify(obj);
    return this.http.post<friendAccept[]>(url, body, httpOptions).toPromise()
    .then( respone => respone)
    .catch( err => err);
  } 


   reloadUser(_id) {
      const url= "http://localhost:3000/user/getuser";
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'my-auth-token'
        })
      };
      const obj= { _id:_id};
      const body= JSON.stringify(obj);
      return this.http.post<User>(url, body, httpOptions).toPromise()
      .then( respone => respone)
      .catch( err =>{ throw err});
    }

  getListNoti(listNoti: Array<any>): Promise<Notifican[]> {
    const url= "http://localhost:3000/notifi/getnoti";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const obj= { arrId: listNoti};
    const body= JSON.stringify(obj);
    return this.http.post<Notifican[]>(url, body, httpOptions).toPromise()
    .then( respone => respone)
    .catch( err => err);
  }  



  login(value) {
    const url= "http://localhost:3000/user/signIn";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(value);
    return this.http.post<User>(url, body, httpOptions);

  }

  lognUp(value) {
    const url= "http://localhost:3000/user/signUp";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(value);
    return this.http.post(url, body, httpOptions);
  }

  onSeach(userName, time): Promise<User[]> {
    const url= "http://localhost:3000/user/users";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const obj= { userName: userName, time: time};
    const body= JSON.stringify(obj);
     return this.http.post<User[]>(url, body, httpOptions)
     .toPromise()
     .then( res => res)
     .catch( err => {
         throw err
        
     })
  }

  updateImg(value) {
    const url= 'http://localhost:3000/user/updateImg';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(value);
    console.log(body);
    return this.http.post(url, body, httpOptions);

  }


















  onAvatar(value) {
    const url= "http://localhost:3000/user/vuong";
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     //'Authorization': 'my-auth-token'
    //   })
    // };
    const body= JSON.stringify(value);
    return this.http.post(url, body );
  }


  join(_id: string) {
    const compare= this.user._id.localeCompare(_id);
   let idRoom= '';
    if( compare> 0){ 
       idRoom= this.user._id+ _id;
    }
    else{
       idRoom= _id+ this.user._id;
    }
    this.socket.emit("Client-send-room", idRoom );
  }

  joinAll(listUser: User[]) {
    console.log('list', listUser);
    listUser.forEach( user => {
      console.log(user);
      this.join(user._id);
    })
  }

  sendRoom() { 
     this.socket.emit("Client-send-room2", localStorage.getItem('room') )
  }

   setMsg(msg: string) {
    this.socket.emit("Client-send-msg", msg );
  }

}
