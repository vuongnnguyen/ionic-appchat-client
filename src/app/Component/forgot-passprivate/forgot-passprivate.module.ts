import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPassprivatePageRoutingModule } from './forgot-passprivate-routing.module';

import { ForgotPassprivatePage } from './forgot-passprivate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPassprivatePageRoutingModule
  ],
  declarations: [ForgotPassprivatePage]
})
export class ForgotPassprivatePageModule {}
