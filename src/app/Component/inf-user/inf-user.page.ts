import { Component, OnInit } from '@angular/core';

import { User } from '../../model/interface';
import { ChatServicesService } from '../Services/chat-services.service';
import { FormGroup } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-inf-user',
  templateUrl: './inf-user.page.html',
  styleUrls: ['./inf-user.page.scss'],
})
export class InfUserPage implements OnInit {
  arrDontDisabled = [];
  err: string;
  errPass: string;
  formForgotPass: FormGroup;
  
  constructor(private _services: ChatServicesService) { }

  ngOnInit() {
  }
 
  changePassWord(formPass: FormGroup) {
    this._services.changePass(formPass.value)
    .then( res => {
      this.errPass= undefined;
      this._services.deleteCookie('token');
      this._services.setCookie('token', res.token, 1);
    })
    .catch( err =>{ 
      console.log(err);
      this.errPass=err.message})
  }

  onUpdate()  {
    const obj= {id: this._services.user._id, name: $('#name').val().toString(), userName: $('#userName').val().toString() };
    this._services.upDateUser(obj)
    .then( res => {
      this.err= undefined;
      this._services.user.name = res.user.name;
      this._services.user.userName = res.user.userName;
      this._services.deleteCookie('token');
      this._services.setCookie('token', res.token, 1); 
      this.arrDontDisabled = [];
    })
    .catch( err =>{
      this.err = err.message;
    });
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
