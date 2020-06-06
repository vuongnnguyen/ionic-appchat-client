import { Component, OnInit } from '@angular/core';

import { ChatServicesService } from '../Services/chat-services.service';
import { listAccept, friendAccept  } from '../../model/interface';

@Component({
  selector: 'app-invite-friend',
  templateUrl: './invite-friend.page.html',
  styleUrls: ['./invite-friend.page.scss'],
})
export class InviteFriendPage implements OnInit {
  listAceepts: friendAccept[] = [];
  listIdsend = [];
  litsUser: listAccept[] = [];
  listFriends: friendAccept[] = [];

  constructor(private _services: ChatServicesService) {
    this._services.socket.on('Server-waitAddFriends', user => {
        console.log(user)
        this.listFriends.splice(0, 0, user);
    });
    this._services.socket.on('Backup-addfriend', accept => {
      const index = this.listFriends.findIndex( user => {
        return user._id == accept;
      })
      this.listFriends.splice(index, 1);
      const indexs = this._services.user.friendaccepts.findIndex( friend => {
        return friend == accept;
      });
      if(index == -1) return;
      this._services.user.friendaccepts.splice( indexs, 1)
    });
   };

  async ngOnInit() {
    await this.loadAccept();
    }

    checkFriend( _id: string ) {
      const index = this._services.user.friends.findIndex( friend => {
        return friend == _id;
      });
      if(index == -1) return false;
      return true;
    };

    async loadAccept() {
      this.listIdsend = [];
      this.listAceepts = [];
      await this._services.getListAccept(this._services.user._id, this.listAceepts.length)
      .then( respone => {  
          if(respone.length == 0) return; 
          this.listAceepts= respone;
          respone.forEach( respone => {
            this.listIdsend.push(respone.idsend);
          })
      })
      .catch( err => console.log(err));

      if(this.listAceepts.length == 0) return;

      this.litsUser=[];
      await this._services.getListUser(this.listIdsend)
      .then( respone => {
        if(respone.length == 0) return;
            this.litsUser = respone;
        
      })
      .catch(err => console.log(err.message));
      
      this.listAceepts.forEach( auser => {
          const user: listAccept= this.getType(auser.idsend);
          auser.name= user.name;
          auser.urlImg= user.urlImg;
          // auser._idfriend= user._id;
      })
      this.listFriends = this.listFriends.concat(this.listAceepts);
  }


  getType(_id) {
    let user: listAccept;
    this.litsUser.forEach( auser => {
      if(auser._id == _id) return user = auser;
    })
    return user;
  }

  async loadData(event) {
    await this.loadAccept();
    event.target.complete();
  }

  accepAdd(friend: friendAccept, index) {
 
    // this.listAceepts[index].status= ' ban be ne'
    const compare = this._services.user._id.localeCompare(friend.idsend+'');
    let nameRoom = '';
     if( compare > 0) nameRoom = this._services.user._id+ friend.idsend;
     else nameRoom = friend.idsend + this._services.user._id;
    const room = {_idaccep: this._services.user._id, urlImg: this._services.user.urlImg, imgfd: friend.urlImg, nameaccep: this._services.user.name, namefriend: friend.name, _idfd: friend.idsend, name: nameRoom};
    this._services.socket.emit('Client-accepAdd', room);
  }


}
