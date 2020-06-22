import { Component, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { handelNickName } from '../../../../model/interface';
import * as $ from 'jquery';
import { AlertController } from '@ionic/angular';
import { ChatServicesService } from '../../../Services/chat-services.service';
import { ModalController } from '@ionic/angular';

// export interface handelNickName{
//   iduser: string;
//   name: string;
//   nickName: string;
//   urlImg: string;
// }

@Component({
  selector: 'app-nicknames',
  templateUrl: './nicknames.component.html',
  styleUrls: ['./nicknames.component.scss'],
})
export class NicknamesComponent implements OnInit {

  @Input() idroom: string;
  @Input() listAllNickName: handelNickName[];
  constructor(private alertCtrl: AlertController, private _serivces: ChatServicesService, private modelController: ModalController) { }

  ngOnInit() {}

  onBack() {
    this.modelController.dismiss();
  }

  async changeNickName(user: handelNickName) {
    const createdGroup = await this.alertCtrl.create({
      header: 'Thay doi biet danh',
        message: 'Nhap biet danh.',
        inputs: [{
          name: 'nickname',
          type: 'text',
          placeholder: 'Biet danh' 
        }],
        buttons: [
          {
          text: 'Cancel',
          handler: () => console.log('cancel'),
          role: 'cancel'
          },
          {
            text: 'Create',
            handler: form => {
              if(form.nickname.trim()== '') return;
              const obj= {  iduser: user.id, idroom: this.idroom, nickname: form.nickname.trim()};
              this._serivces.managementRoom(obj, 'https://localhost:3000/user/change-nickname')
              .then( res => {
                this._serivces.socket.emit('Client-send-change-nickName', obj);
                this.listAllNickName.forEach( docs => {
                  if( docs.id== user.id) docs.nickname= user.nickname;
                })
              })
              .catch( err => { console.log(err.message)});
            }
          }
        ]
      });
      await createdGroup.present();
    
  }

  getNickName(nickname: handelNickName): string {
      if(nickname.nickname== 'nulls') return nickname.name;
      return nickname.nickname;
  }

}
