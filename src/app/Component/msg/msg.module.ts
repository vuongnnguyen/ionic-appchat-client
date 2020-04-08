import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MsgPageRoutingModule } from './msg-routing.module';

import { MsgPage } from './msg.page';
import { AutosizeModule } from 'ngx-autosize';
import { SettingRoomComponent } from './setting-room/setting-room.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MsgPageRoutingModule,
    AutosizeModule,
  ],
  declarations: [MsgPage]
})
export class MsgPageModule {}
