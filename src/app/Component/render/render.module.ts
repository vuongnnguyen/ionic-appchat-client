import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenderPageRoutingModule } from './render-routing.module';

import { RenderPage } from './render.page';
import { SeachsComponent } from './seachs/seachs.component';
import { ViewmessageComponent } from './viewmessage/viewmessage.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RenderPageRoutingModule
  ],
  declarations: [RenderPage, SeachsComponent, ViewmessageComponent]
})
export class RenderPageModule {}
