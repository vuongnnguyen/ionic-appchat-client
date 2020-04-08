import { Component, OnInit } from '@angular/core';

import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(private menu: MenuController) { }

  ngOnInit() {
    // this.openFirst()
  }

  openFirst() {
    console.log('dao vao ')
    this.menu.enable(true, 'first');
    this.menu.open('first');
    console.log('ket thuc')
  }

  openFirstt(){
    console.log('day la vuong')
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }


}
