import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../model/interface';
import { ChatServicesService } from '../Services/chat-services.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import { Router } from '@angular/router';


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
  uploadForm : FormGroup;
  urlImg = '';
  data : any;
  imageURL : string ='';

  @ViewChild('fileBtn',{static : false}) fileBtn: {
		nativeElement: HTMLInputElement
  }
  
  constructor(private formBuilder: FormBuilder, private _services: ChatServicesService, private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.urlImg = this._services.user.urlImg;
  }


  onLognout() {
    this._services.socket.emit('log-out', this._services.user._id);
    this._services.deleteCookie('token');
    this.router.navigate(['/login'])
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
  
  //Update voi viewChild
  updateProfilePic() {
		this.fileBtn.nativeElement.click()
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


  onSubmit() {
    const url= "http://vuongdeptrai.herokuapp.com/user/vuong";
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('profile').value);

    this._services.onSubmitFile(formData)
    .then( res => {
      console.log(res)
      this.urlImg = res.fileName;
      this._services.user.urlImg = res.fileName;
      const data= {_id: this._services.user._id, urlImg: res.fileName };
      this._services.updateImg(data);
    })
    .catch( err => {
      console.log('loi  rpo');
      console.log(err.message)
    })


  }



  onFileSelect(event) {
    console.log(this.uploadForm)

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
    }
  }



  onSelectFile(e) {
    const value = e.target.files;
    this.urlImg = value;

  }
  onSubMitFile(e) {
    const formData = new FormData();
    const value = $('#profile').val().toString()
    this.urlImg = value;
    console.log(value)
    formData.append('file', this.urlImg);
    this._services.onSubmitFile(formData)
    .then( res => {
      console.log(res)
      this.urlImg = res.fileName;
      this._services.user.urlImg = res.fileName;
    })
    .catch( err => {
      console.log('loi  rpo');
      console.log(err.message)
    })
    
  }

  //Chon hinh anh lay duong link uploadcare <img src="https://ucarecdn.com/{{ imageURL: cai nay imageURL vua posts dc }}/-/preview/-/scale_crop/200x200/center/" />
  fileChanged(event) {
    
    const files = event.target.files
    
    this.data = new FormData()
    
    this.data.append('file',files[0]);
    this.data.append('UPLOADCARE_STORE', '1');
    this.data.append('UPLOADCARE_PUB_KEY', '91b8c870b3213b3cf337');
    
		this.http.post('https://upload.uploadcare.com/base/',this.data)
		.subscribe((event: any)  => {
			console.log(event)
      this.imageURL = event.file
      //Day la image url da post dc => 
      //may chi can cho imageURl nay cho vao co so du lieu thoi
    })
    
  }

}