import { Component, OnInit, Input } from '@angular/core';

import { ChatServicesService } from '../../../Services/chat-services.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { userSeach, room, objUser, msg } from '../../../../model/interface';
//simport {  } from '../setting-room.component';

@Component({
  selector: 'app-addmember',
  templateUrl: './addmember.component.html',
  styleUrls: ['./addmember.component.scss'],
})

export class AddmemberComponent implements OnInit {

  @Input() room: room;
  @Input() listNameUser: objUser[];

  seachUserName= '';
  listUser: userSeach[]= [];
  amsg: msg;
  
  constructor(private _services: ChatServicesService, private router: Router, public modalController: ModalController) { }

  ngOnInit() {
    // if(!this.listNameUser){
    //   this.listNameUser= [];
    // }
  }

  async onBack() {
    this.modalController.dismiss()
  }

  goChatMessage(iduser){
    const compare= this._services.user._id.localeCompare(iduser+'');
    let nameRoom = '';
     if( compare > 0){ 
        nameRoom= this._services.user._id+ iduser;
     }
     else{
        nameRoom = iduser + this._services.user._id;
     }
     this.router.navigate([`/home/chat/${nameRoom}`]);


  }

  addMember(id: string, username: string) {
    this._services.socket.emit('Client-addMember-joinsocket', { iduser: id, idroom: this.room.idroom});
    const obj = { idroom: this.room.idroom, iduser: id, idadd: this._services.user._id, usernameadd: this._services.user.name, username: username };
    this._services.addMember(obj)
    .then( res => {
      this.amsg = res;
      this.amsg.urlImg = this.room.urlImg; 
      this.amsg.room = this.room.name;
      this.amsg.color = this.room.color;
      this.amsg.type = this.room.type;
      this.listNameUser.push(this.amsg.listNameUser[0]);
      this.amsg.listNameUser= this.listNameUser;
      this._services.socket.emit('Client-send-addMember', this.amsg);
    })
    .catch( err => console.log(err.message));
  }

  isJoinedGroup(id: string): boolean {
    // if(!this.listNameUser){
      // this.listNameUser= [];
      //  return false;}
    const index = this.listNameUser.findIndex( docs => {
      return docs.id == id;
    });
    if(index == -1) return false;
    return true;
  }

  onSeach() {
    if($('#seach').val().toString() == '') return;
    const obj= { contentSeach: $('#seach').val().toString(), iduser: this._services.user._id, skip: this.listUser.length };
    this._services.seachMember(obj)
    .then( res => {
   
      this.listUser= this.listUser.concat(res);
  
    })
    .catch( err => console.log(err.message))
  }

}
