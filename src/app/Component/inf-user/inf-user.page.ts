import { Component, OnInit } from '@angular/core';

import { User } from '../login/login.page';
import { ChatServicesService } from '../Services/chat-services.service';
import { FormGroup } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-inf-user',
  templateUrl: './inf-user.page.html',
  styleUrls: ['./inf-user.page.scss'],
})
export class InfUserPage implements OnInit {

  arrDontDisabled= [];
  err;

  constructor(private _services: ChatServicesService) { }

  ngOnInit() {
  }

  onUpdate()  {
    const obj= { name: $('#name').val().toString(), userName: $('#userName').val().toString() };
    this._services.upDateUser(obj)
    .then( res => {
      this.err= undefined;
      this._services.user.name= obj.name;
      this._services.user.userName= obj.userName;
      this.arrDontDisabled= []
    })
    .catch( err =>{
      this.err= err.message;
      
    })
    
  }

  dontDisabled(type: string): void {
      this.arrDontDisabled.push(type);
  }

  isDisabled(type: string): boolean {
    const index= this.arrDontDisabled.findIndex( item => {
      return item== type;
    })
    if(index == -1) return true;
    return false;
  }

}
