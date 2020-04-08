import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfUserPageRoutingModule } from './inf-user-routing.module';

import { InfUserPage } from './inf-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfUserPageRoutingModule
  ],
  declarations: [InfUserPage]
})
export class InfUserPageModule {}
