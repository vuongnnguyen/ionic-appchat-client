import { Component, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { ChatServicesService } from '../Services/chat-services.service';
import { User } from '../../model/interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  formSignUp: FormGroup;

  constructor(private _services: ChatServicesService, private router: Router) { }

  ngOnInit() {
  }

  onSignUp(formSignUp: FormGroup) {
    this._services.lognUp(formSignUp.value).subscribe( respone => {
      console.log(respone);
      this.router.navigate(["/login"]);
    }, err => console.log(err.message));
  } 

}
