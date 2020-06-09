import { Component, OnInit } from '@angular/core';
import { ChatServicesService } from '../Services/chat-services.service';
import { AlertController } from '@ionic/angular';
import { msg} from '../../model/interface';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {

  constructor(private _services: ChatServicesService, private alertCtrl: AlertController) { }
  msgs: msg[] = [];
  listMsg: msg[] = [];
  ngOnInit() {
  }
  async createGroup() {
    const createdGroup= await this.alertCtrl.create({
      header: 'Tao Group',
      message: 'Nhap ten group.',
      inputs: [{
        name: 'nameGroup',
        type: 'text',
        placeholder: 'Nhap ten Group' 
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
            let obj= {username: this._services.user.name ,iduser: this._services.user._id, namegroup: form.nameGroup, idroom: `${this._services.user._id}${new Date().getTime()}${Math.floor(Math.random() * 10)}` };
            if(form.nameGroup == '') {
              obj= {username: this._services.user.name, iduser: this._services.user._id, namegroup: `${new Date().getTime()}${Math.floor(Math.random() * 10)}`, idroom: `${this._services.user._id}${new Date().getTime()}${Math.floor(Math.random() * 10)}`};
            }
            this._services.createGroup(obj)
            .then( res => {
          
              this.listMsg.splice(0, 0, res)
            })
            .catch( err => console.log(err.message));
          }
        }
      ]
    });
    await createdGroup.present();
  }
}
