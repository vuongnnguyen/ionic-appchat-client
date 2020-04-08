import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { ChatServicesService } from '../Services/chat-services.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-render', 
  templateUrl: './render.page.html',
  styleUrls: ['./render.page.scss'],
})
export class RenderPage implements OnInit {

  seach= new FormControl('');
  checkButton= false;
  checkSeach= false;

  constructor(private _services: ChatServicesService) { 
  }

  ngOnInit() {

    // setInterval( () => {
    //   this.checkSeach= this._services.checkSeach;
    // }, 100);
    // console.log('ggggggggggggggggggggg')

    // this._services.socket.on('test-thu', data =>{
    //   console.log('dayyyyyyyy' + data)
    // })

  } 

}
