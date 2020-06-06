import { Component, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { ChatServicesService } from '../Services/chat-services.service';
import { Router } from '@angular/router';
import { User } from '../../model/interface';
import * as $ from 'jquery';


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
  }

  onLogin(formLogin: FormGroup) {
    this._services.login(formLogin.value).subscribe( respone => {
      const token = respone.token;
      this.user = respone.user;
      this._services.user = this.user;
      this._services.setCookie('token', token, 1);
      this.router.navigate(["/home"]);
      this._services.socket.emit('Client-join-room', this.user.room );
    }, err => this.err= err.message );
  }





}
