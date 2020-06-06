import { Component, OnInit, Input, ɵConsole } from '@angular/core';

import { ChatServicesService } from '../../Services/chat-services.service';
import * as $ from 'jquery';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../../model/interface';


@Component({
  selector: 'app-seachs',
  templateUrl: './seachs.component.html',
  styleUrls: ['./seachs.component.scss'],
})
export class SeachsComponent implements OnInit {

  // @Input() seach;
  seach="";
  checkSeach= false;
  err;
  listUser: User[]= [];

  items = [];

  listLoading= [];
  user: User;

  constructor(private _services: ChatServicesService, private router: Router) { 
  

      this._services.socket.on('Server-addFriend', idfd =>{
        this._services.user.friends.push(idfd);
      })

      this._services.socket.on('Server-send-idsend-dontload', id => {
        const index= this.listLoading.findIndex( _id => {
            return _id== id;
        });
        this.listLoading.splice(index, 1);
      })
  }

  async ngOnInit() {
    this.user= this._services.user;
  };

  goChatMessage(iduser){
    const compare= this._services.user._id.localeCompare(iduser+'');
    let nameRoom= '';
     if( compare> 0){ 
        nameRoom= this._services.user._id+ iduser;
     }
     else{
        nameRoom= iduser+ this._services.user._id;
     }
     this.router.navigate([`/home/chat/${nameRoom}`]);
  };


  isLoading(_id):boolean{
      const index= this.listLoading.findIndex( id => {
        return id== _id
      });
      if(index==-1) return false;
      return true;
  };

  backupAddFriend(_id: string) {
    this.listLoading.push(_id);
    this.deleteDocumemt(this._services.user.waitaccept, _id);
    const backupAdd= { idsend: this._services.user._id, idto: _id};
    this._services.socket.emit('Client-send-backupAdd', backupAdd);
  };
 
  deleteDocumemt(arr: Array<any>, _id: String) {
    const index= arr.findIndex( document => {
      return document== _id;
    });
    if( index== -1) return;
    arr.splice(index, 1);
  };

  checkWaitAccept(_id: string) {
    const index= this._services.user.waitaccept.findIndex( userWaiat => {
      return userWaiat== _id;
    });
    if(index==-1) return false;
    return true;
  };

  checkFriends(_id: string) {
    const index= this._services.user.friends.findIndex( friend => {
      return friend == _id;
    });
    if(index == -1) return false;
    return true;
  };

  addFriend(_id: string) {
    this.listLoading.push(_id)
    this._services.user.waitaccept.push(_id);
    const friends= { _idsend: this._services.user._id, urlImg: this._services.user.urlImg, name: this._services.user.name ,_idto: _id }
    this._services.socket.emit('Client-send-addFriend', friends);
  };

  goNotifi() {
    this.router.navigate(["/invite-friend"])
  }





  async onSeach(time, clickked){
    if(clickked) this.listUser= [];
    this._services.checkSeach= true;
    this.checkSeach= true;  
     await this._services.onSeach($("#vuong").val().toString(), time)
    .then(respone => {
      this.err= undefined;

      respone.forEach( user => {
        this.listUser.push(user);
      });
      
      // const kq= await new Promise( (resolve, rejects) => { 
      //   resolve(true)
      // })
      // return kq;
    })
    .catch( err => { 
      if(clickked) this.err= err.error;
      console.log("loi",err.error);
      // const kq= await new Promise( (resolve, rejects) => { 
      //   resolve(false)
      // })
      // return kq;
    })
    // return x;

    
    //   this._services.onSeach($("#vuong").val().toString(), time).subscribe( respone => {
    //   this.err= undefined;
    //   console.log(respone);
    //   respone.forEach( user => {
    //     this.listUser.push(user);
    //   });
    //   return true.to
    // }, err => {
    //   if(clickked) this.err= err.error;
    //   console.log("loi",err.error);
    //   return false;
    // })
  }


//   async testt() {
//     const kq = await new Promise( (resolve, rejects) =>{
//         resolve('vuonoggg');
//     })
//     return kq;
// }

  onBack() {
    const data= new Date();
    $("#vuong").val("");
    this.checkSeach= false;
    this._services.checkSeach= false;
  }

  async loadData(event) {
    await this.onSeach(this.listUser[this.listUser.length-1].created, false);
    // if(kq) {
  
      event.target.complete();
    // }
   
  }






}
