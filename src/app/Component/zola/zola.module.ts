import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZolaPageRoutingModule } from './zola-routing.module';

import { ZolaPage } from './zola.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZolaPageRoutingModule
  ],
  declarations: [ZolaPage]
})
export class ZolaPageModule {}
