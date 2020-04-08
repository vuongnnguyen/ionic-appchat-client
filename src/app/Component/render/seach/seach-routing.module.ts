import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeachPage } from './seach.page';

const routes: Routes = [
  {
    path: '',
    component: SeachPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeachPageRoutingModule {}
