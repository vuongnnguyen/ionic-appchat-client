import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenderPage } from './render.page';

const routes: Routes = [
  {
    path: '',
    component: RenderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenderPageRoutingModule {}
