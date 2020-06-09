import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';

import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as MYINTERFACE from '../../model/interface';

 
@Injectable({
  providedIn: 'root'
})
export class ChatServicesService {
  public socket: SocketIOClient.Socket;
  user: MYINTERFACE.User;
  msg= '';
  send= false;
  seach= "";
  checkSeach= false;
  // listLoading= [];

  listStatusUser : MYINTERFACE.statusUser[] = [];




  constructor( private http: HttpClient, public toastController: ToastController, private router: Router) {
    window.onbeforeunload  = () =>{
      alert('ok')
    }

  

    this.socket = io('http://vuongdeptrai.herokuapp.com');
    this.socket.on("Server-send-chat", data => {
      // $("#tn").text(data);
      // this.setMsg(data);
    });

    this.socket.on('Server-logout', ( data : MYINTERFACE.statusUser ) => {
      console.log('co nguoi ofline', data);

      this.listStatusUser.forEach( item => {
        if(item._id == data._id) {
          item = data;
        }
      });
      console.log(this.listStatusUser)
    });

    this.socket.on('Server-send-online',( data : MYINTERFACE.statusUser ) => {
      console.log('co nguoi online', data);
      this.listStatusUser.forEach( item => {
        if(item._id == data._id) {
          item = data;
        }
      });
      console.log(this.listStatusUser)
    });

    this.socket.on('Server-check-user', data => {
      this.socket.emit('Client-check-user', true);
    })

    this.socket.on("Server-send-amsg", (msg: MYINTERFACE.msg) => {
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
    
       // this.listFriends.splice(0, 0, user);
        // this.user.waitaccept.push(user);
        this.user.friendaccepts.push(user._id)

    })

    this.socket.on('Server-notifiAddFr', (noti: MYINTERFACE.Notifican) =>{
      this.user.notification.push(noti._id);
    });

    this.socket.on('Server-addFriend', room => {
      this.socket.emit('Client-join-room', { id: this.user._id, urlImg : this.user.urlImg, rooms :[room.nameroom]})
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
    
    this.socket.on('Server-send-createdGroup', (data: MYINTERFACE.msg) => {
      this.socket.emit('Client-join-room', { id: this.user._id, urlImg : this.user.urlImg, rooms :[data.roomname]}  )
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
      this.socket.emit('Client-join-room', { id: this.user._id, urlImg : this.user.urlImg, rooms: [ data.idroom]})
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
      this.socket.emit('Client-join-room', { id: this.user._id, urlImg : this.user.urlImg, rooms: [data.idroom]})
    });

    this.socket.on('Server-send-leave-room', data => {
      // viet them
      const index = this.user.room.findIndex( item => {
        return item == data.idroom;
      });
      this.user.room.splice(index, 1);
      // ket thuc

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

   handleUserStatus(id) : { isOnline: boolean, contentHome: string, contentMsg: string  } {
     let isOnline = false;
     let contentHome = '';
     let contentMsg = '';
     let time = +Date.now().toString();
     let user : MYINTERFACE.statusUser;
     user = this.listStatusUser.find( item => {
        return item._id == id;
      });

      if(!user) return { isOnline: false, contentHome: '', contentMsg: ''  };
      if(!user.isOffline) return { isOnline: true, contentHome: '', contentMsg: '' };
      isOnline = false;

      if(+Date.now().toString() - (+user.timeOff) < 60000) {
          contentHome = '';
          contentMsg = 'Hoat động vài giây trước';
          return { isOnline, contentHome, contentMsg };
      }

      if(+Date.now().toString() - (+user.timeOff) >= 60000 && 
         +Date.now().toString() - (+user.timeOff) < 3600000 ) {
            contentMsg = `Hoạt động ${Math.round(+Date.now().toString() - (+user.timeOff)/60000)} phút trước`
            contentHome = `+Date.now().toString() - (+user.timeOff)/60000) p`;
            return { isOnline, contentHome, contentMsg };
      }

      if(+Date.now().toString() - (+user.timeOff) >= 3600000 &&
         +Date.now().toString() - (+user.timeOff) < (3600000 * 48)) {
          contentMsg = `Hoạt động ${Math.round(+Date.now().toString()/3600000)} trước`;
          contentHome = `${Math.round(+Date.now().toString()/3600000)} h`;
          return { isOnline, contentHome, contentMsg };
      }

      contentHome = '';
      let day = new Date(user.timeOff)
      contentMsg = day.toLocaleString();
      return { isOnline, contentHome, contentMsg };
       
   }


   getStatusUser(iduser) {
    const url= 'http://vuongdeptrai.herokuapp.com/user/getStatusUser';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify({id : iduser});
    return this.http.post<MYINTERFACE.statusUser[]>(url, body, httpOptions ).toPromise()
    .then( respone => {
      this.listStatusUser = respone;
    })
    .catch( err => console.log(err.message));
   }

   getInfoToast(message: MYINTERFACE.msg): {nameroom: string, namesend: string} {
      if(message.type== 'aroom'){
        if(message.nickname== 'nulls') {return {nameroom: message.name, namesend: message.name};}
        return {nameroom: message.nickname, namesend: message.nickname};
      }
      if(message.nickname== 'nulls') { return {nameroom: message.room, namesend: message.name}};
      return {nameroom: message.room, namesend: message.nickname};
   }

   async presentToastWithOptions(message: MYINTERFACE.msg) {
     const info= this.getInfoToast(message);
    const toast = await this.toastController.create({
      header: info.nameroom,
      message: `${info.namesend}: ${message.msg}. ${message.created}`,
      position: 'top',
      duration: 5000,
      showCloseButton: true,
      buttons: [
        {
          // side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            this.router.navigate([`/home/chat/${message.roomname}`]);
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }



   getUserrr(): Promise<MYINTERFACE.User> {
    const url= 'http://vuongdeptrai.herokuapp.com/user/get-user';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.getCookie('token')
      })
    };
    const body= JSON.stringify({dd: 'dd'});
    return this.http.post<MYINTERFACE.User>(url, body, httpOptions ).toPromise()
    .then( res => res)
    .catch( err => {
      console.log(err.message)
       throw err})
 }

   middleWare(): Promise<{stt: boolean, user: MYINTERFACE.User}> {
     const url= 'http://vuongdeptrai.herokuapp.com/user/middle-ware';
     const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.getCookie('token')
      })
    };
    const body= JSON.stringify({token: this.getCookie('token') });
    return this.http.post<{stt: boolean, user: MYINTERFACE.User}>(url, body, httpOptions ).toPromise()
    .then( res => res)
    .catch( err => {
      console.log(err.message);
       throw err})
  }
     
   

  deleteCookie(name: string) {
    document.cookie = name+'=; Max-Age=-99999999;';
  }

   setCookie(key, value, timeExpries) {
    let newDay= new Date();
    newDay.setTime(timeExpries*60*60*1000+ newDay.getTime());
    document.cookie= `${key}=${value}; expires=${newDay.toUTCString()}`;

   }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

   addMember(obj): Promise<MYINTERFACE.msg> {
    const url= 'http://vuongdeptrai.herokuapp.com/user/add-member';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(obj);
    return this.http.post<MYINTERFACE.msg>(url, body, httpOptions ).toPromise()
    .then( res => res)
    .catch( err => {
      console.log(err.message)
       throw err})
 }

   seachMember(obj): Promise<MYINTERFACE.userSeach>{
      const url= 'http://vuongdeptrai.herokuapp.com/user/seach-member';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'my-auth-token'
        })
      };
      const body= JSON.stringify(obj);
      return this.http.post<MYINTERFACE.userSeach>(url, body, httpOptions ).toPromise()
      .then( res => res)
      .catch( err => { throw err})
   }

   createGroup(obj): Promise<MYINTERFACE.msg> {
     const url= 'http://vuongdeptrai.herokuapp.com/user/create-group';
     const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(obj);
    return this.http.post<MYINTERFACE.msg>(url, body, httpOptions ).toPromise()
    .then( res => {
      this.user.room.push(res.roomname);
      this.user.msg.push(res._id);
      this.socket.emit('Client-send-createdGroup', res);
      this.socket.emit('Client-join-room', { id: this.user._id, urlImg : this.user.urlImg, rooms : [res.roomname]})
      return res;
    })
    .catch( err => { throw err});
   }

   deleteAmsg(obj): Promise<{index: number, message: MYINTERFACE.msg}> {
    const url= 'http://vuongdeptrai.herokuapp.com/user/delete-amsg';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(obj);
    return this.http.post<{index: number, message: MYINTERFACE.msg}>(url, body, httpOptions).toPromise()
    .then( res => res)
    .catch( err => { throw err})
   } 
   
  updateTime(obj) : Promise<boolean> {
    const url= 'http://vuongdeptrai.herokuapp.com/user/update-seen-msg';
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
    const url= 'http://vuongdeptrai.herokuapp.com/user/delete-allmsg';
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

   
  getMessageinRoom(roomname, skip, iduser): Promise<MYINTERFACE.objMessage> {
      const url = 'http://vuongdeptrai.herokuapp.com/user/get-messagess';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'my-auth-token'
        })
      };
      const obj= { roomname: roomname, skip: skip, iduser: iduser };
      const body= JSON.stringify(obj);
      return this.http.post<MYINTERFACE.objMessage>( url, body,  httpOptions).toPromise()
      .then( respone => respone)
      .catch( err =>  { throw err })

  }



  changePass(obj): Promise<{token: string}> {
    const url = 'http://vuongdeptrai.herokuapp.com/user/change-pass';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.getCookie('token')
      })
    };
    const body= JSON.stringify(obj);
    console.log(obj);
    return this.http.post<{token:string}>( url, body,  httpOptions).toPromise()
    .then( respone => {
      console.log(respone);
      return respone
    })
    .catch( err =>  { throw err })
  }

  upDateUser(obj): Promise<{user:{name: string, userName: string}, token: string}> {
    const url= 'http://vuongdeptrai.herokuapp.com/user/update-user';
    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      })
    }
    const body= JSON.stringify(obj);
    return this.http.post<{user:{name: string, userName: string}, token: string}>(url, body, httpOptions).toPromise()
    .then( res => res) 
    .catch( err => {throw err})
  }
  

  getListMsg(listmsg: Array<any>, skip: number, myid): Promise<MYINTERFACE.objMsgUser> {
      const url= 'http://vuongdeptrai.herokuapp.com/user/getlistmsg';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'my-auth-token'
        })
      };
      const obj= { arrMsg: listmsg, skip: skip, myid: myid };
      const body= JSON.stringify(obj);
      return this.http.post<MYINTERFACE.objMsgUser>( url, body,  httpOptions).toPromise()
      .then( respone => {
  
        return respone})
      .catch( err =>  { throw err })
  } 


   getListUser(listUser: Array<string>): Promise<MYINTERFACE.listAccept[]>{
    const url= "http://vuongdeptrai.herokuapp.com/user/getlistuser";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const obj= { listUser: listUser};
    const body= JSON.stringify(obj);
    return this.http.post<MYINTERFACE.listAccept[]>(url, body, httpOptions).toPromise()
    .then( respone => respone)
    .catch( err => err);
  } 
    
   getListAccept(iduser, skip): Promise<MYINTERFACE.friendAccept[]> {

    const url= "http://vuongdeptrai.herokuapp.com/user/getaccept";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const obj= { iduser : iduser, skip: skip};
    const body= JSON.stringify(obj);
    return this.http.post<MYINTERFACE.friendAccept[]>(url, body, httpOptions).toPromise()
    .then( respone => respone)
    .catch( err => err);
  } 


   reloadUser(_id) {
      const url= "http://vuongdeptrai.herokuapp.com/user/getuser";
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          //'Authorization': 'my-auth-token'
        })
      };
      const obj= { _id:_id};
      const body= JSON.stringify(obj);
      return this.http.post<MYINTERFACE.User>(url, body, httpOptions).toPromise()
      .then( respone => respone)
      .catch( err =>{ throw err});
    }

  getListNoti(iduser, skip): Promise<MYINTERFACE.Notifican[]> {
    const url= "http://vuongdeptrai.herokuapp.com/notifi/getnoti";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const obj= { iduser, skip};
    const body= JSON.stringify(obj);
    return this.http.post<MYINTERFACE.Notifican[]>(url, body, httpOptions).toPromise()
    .then( respone => respone)
    .catch( err => err);
  }  



  login(value) {
    const url= "http://vuongdeptrai.herokuapp.com/user/signIn";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(value);
    return this.http.post<{user: MYINTERFACE.User, token: string}>(url, body, httpOptions);

  }

  lognUp(value) {
    const url= "http://vuongdeptrai.herokuapp.com/user/signUp";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    }; 
    const body= JSON.stringify(value);
    return this.http.post(url, body, httpOptions);
  }

  onSeach(userName, time): Promise<MYINTERFACE.User[]> {
    const url= "http://vuongdeptrai.herokuapp.com/user/users";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const obj= { userName: userName, time: time};
    const body= JSON.stringify(obj);
     return this.http.post<MYINTERFACE.User[]>(url, body, httpOptions)
     .toPromise()
     .then( res => res)
     .catch( err => {
         throw err
        
     })
  }

  updateImg(value) {
    const url= 'http://vuongdeptrai.herokuapp.com/user/updateImg';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //'Authorization': 'my-auth-token'
      })
    };
    const body= JSON.stringify(value);

    return this.http.post(url, body, httpOptions);

  }


















  onAvatar(value) {
    const url= "http://vuongdeptrai.herokuapp.com/user/vuong";
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

  joinAll(listUser: MYINTERFACE.User[]) {

    listUser.forEach( user => {
    
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
