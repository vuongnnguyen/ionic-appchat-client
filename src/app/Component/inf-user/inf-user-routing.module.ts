import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfUserPage } from './inf-user.page';

const routes: Routes = [
  {
    path: '',
    component: InfUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfUserPageRoutingModule {}
