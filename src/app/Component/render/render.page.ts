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
  } 

}
