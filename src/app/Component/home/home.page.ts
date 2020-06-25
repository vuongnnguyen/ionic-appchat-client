import { Component, OnInit } from '@angular/core';

import { ChatServicesService } from '../Services/chat-services.service';
import { User } from '../../model/interface';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MenuController, ActionSheetController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  listUser: User[] = [];
  msg = "";
  user: User;
  uploadForm: FormGroup;  

  constructor(private _services: ChatServicesService, private router: Router,
    private formBuilder: FormBuilder, private httpClient: HttpClient, private menu: MenuController
    ,private actionSheetControler: ActionSheetController, private loadingController: LoadingController) {
   }

  async ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.user= this._services.user
  }
  async loadDing(){
    const loading = await this.loadingController.create({
      message: 'Loading cities...'
    });
    await loading.present();
  }

  async presentActionSheet() {
    const actionSheet= await this.actionSheetControler.create({
      header: 'Albums',
      buttons: [{
        text: 'Thông tin tài khoản',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.router.navigate(['/home/infor-user']);
        }
      }, {
        text: 'Quen Mat Khau',
        icon: 'share',
        handler: () => {
        this.router.navigate(['/home/fotrgot-pass-private']);
        }
      }, {
        text: 'Đăng xuất',
        icon: 'arrow-dropright-circle',
        handler: () => {
          this._services.deleteCookie('token');
          this.router.navigate(['/login']);
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {    
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

//   onSubmit() {
//     const url= "https://vuongdeptrai.herokuapp.com/user/vuong";
//     const formData = new FormData();
//     formData.append('file', this.uploadForm.get('profile').value);
//     this.httpClient.post<any>(url, formData).subscribe( res => {
//       const data= {_id: this._services.user._id, urlImg: res.fileName };
//         this._services.updateImg(data)
//   }
// }

  // onFileSelect(event) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.uploadForm.get('profile').setValue(file);
  //   }
  // }

  // onAvatar(formAvatar: FormGroup) {
  //   this._services.onAvatar(formAvatar.value).subscribe( aa => console.log(aa) )
  // }
























 
  // sendMsg(_id: string) {
  //   const compare= this._services.user._id.localeCompare(_id);
  //   let idRoom= '';
  //    if( compare> 0){ 
  //       idRoom= this._services.user._id+ _id;
  //    }
  //    else{
  //       idRoom= _id+ this._services.user._id;
  //    }
  //    localStorage.setItem('room', idRoom);
  //    this._services.sendRoom()
  //    this.router.navigate(["/msg"])
  // }

  // joinRoom(_id: string) {
  //   this._services.join(_id);
  // }

}
