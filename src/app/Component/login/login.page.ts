import { Component, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { ChatServicesService } from '../Services/chat-services.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

export interface User{
  _id: string;
  name: string;
  userName: string;
  friends: Array<any>;
  room: Array<any>
  active: boolean;
  // idsk: string;
  // _id: string;
  // userName: string;
  passWord: string;
  urlImg: string;
  created: number;
  notification: Array<any>;
  waitaccept: Array<any>;
  friendaccepts: Array<any>;
  msg: Array<any>;
  dismissroom: Array<any>;
  hidemsg: Array<any>;
  block: Array<any>;
  // room: Array<any>;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogin: FormGroup;
  user: User;
  err;

  constructor( private _services: ChatServicesService, private router: Router) { }

  ngOnInit() {
    // $(document).ready( () => {
    //   alert("vuong");
    // })
  }


  onLogin(formLogin: FormGroup) {
    this._services.login(formLogin.value).subscribe( respone => {
      const token= respone.token;
      this.user= respone.user;
      this._services.user= this.user;
    
      this._services.setCookie('token', token, 1);
      this.router.navigate(["/home"]);

      this._services.socket.emit('Client-join-room', this.user.room );
      
    }, err => this.err= err.message );
  }





}
