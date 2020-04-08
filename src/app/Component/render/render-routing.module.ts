import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenderPage } from './render.page';

const routes: Routes = [
  {
    path: '',
    component: RenderPage
  },
  {
    path: 'seach',
    loadChildren: () => import('./seach/seach.module').then( m => m.SeachPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenderPageRoutingModule {}
