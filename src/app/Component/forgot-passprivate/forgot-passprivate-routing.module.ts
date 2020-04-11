import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPassprivatePage } from './forgot-passprivate.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotPassprivatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPassprivatePageRoutingModule {}
