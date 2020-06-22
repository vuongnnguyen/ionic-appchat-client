import { Component, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { ChatServicesService } from '../Services/chat-services.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  formSignUp: FormGroup;
  err = '';

  constructor(private _services: ChatServicesService, private router: Router, public alertController: AlertController) { }

  ngOnInit() {
  }

  async onSignUp(formSignUp: FormGroup) {
    this._services.lognUp(formSignUp.value)
    .then(async res => {
      if(res.status == 200){
        this.err = res.data;
        await this.presentAlertConfirm();
      }
      this.err = res.data

    })
    .catch( err => this.err = err.message);
  }
  

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Thông báo!',
      message: `Tại tài khoản thành công vui lòng kiểm tra Email của bạn`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

    

}
