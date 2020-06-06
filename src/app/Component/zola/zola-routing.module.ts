import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZolaPage } from './zola.page';

const routes: Routes = [
  {
    path: '',
    component: ZolaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZolaPageRoutingModule {}
