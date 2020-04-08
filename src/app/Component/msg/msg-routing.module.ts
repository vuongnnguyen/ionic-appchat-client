import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MsgPage } from './msg.page';

const routes: Routes = [
  {
    path: '',
    component: MsgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MsgPageRoutingModule {}
