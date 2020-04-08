import { Component, OnInit } from '@angular/core';

import { ChatServicesService } from '../Services/chat-services.service';
import { User } from '../login/login.page';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MenuController, ActionSheetController } from '@ionic/angular';





@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  listUser: User[]= [];
  msg= "";

  user: User;
  // formAvatar: FormGroup;

  uploadForm: FormGroup;  

  constructor(private _services: ChatServicesService, private router: Router,
    private formBuilder: FormBuilder, private httpClient: HttpClient, private menu: MenuController
    ,private actionSheetControler: ActionSheetController) {
    // this._services.getListUser().subscribe( respone => {
    //   this.listUser= respone;
    //   this._services.joinAll(this.listUser);
    //   console.log(this.listUser);
    // })
   }

  async ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });

    this.user= this._services.user
  
  }

    async presentActionSheet() {
      const actionSheet= await this.actionSheetControler.create({
        header: 'Albums',
        buttons: [{
          text: 'Thông tin tài khoản',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
            this.router.navigate(['/home/infor-user'])

          }
        }, {
          text: 'Bảo mật',
          icon: 'share',
          handler: () => {
            console.log('Share clicked');
          }
        }, {
          text: 'Đăng xuất',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('Play clicked');
          }
        }, {
          text: 'Favorite',
          icon: 'heart',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
      })
      await actionSheet.present();
    
    }


  // openFirst() {
  //   console.log('dao vao ')
  //   this.menu.enable(true, 'first');
  //   this.menu.open('first');
  //   console.log('ket thuc')
  // }

  // openFirstt(){
  //   console.log('day la vuong')
  // }

  // openEnd() {
  //   this.menu.open('end');
  // }

  // openCustom() {
  //   this.menu.enable(true, 'custom');
  //   this.menu.open('custom');
  // }




  onSubmit() {
    const url= "http://localhost:3000/user/vuong";
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('profile').value);

    this.httpClient.post<any>(url, formData).subscribe( res => {
      const data= {_id: this._services.user._id, urlImg: res.fileName };
        this._services.updateImg(data).subscribe(respone => {
          console.log(respone);
        })
    }, err => {
      console.log(err);
    }
     
    );
  }




  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
    }
  }
  

  onAvatar(formAvatar: FormGroup) {
    this._services.onAvatar(formAvatar.value).subscribe( aa => console.log(aa) )
  }
























 
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
