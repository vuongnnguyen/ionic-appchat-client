import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { MiddlewareAtHomeGuard } from '../../guard/middleware-at-home.guard';


const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      { path: '', loadChildren: () => import('../render/render.module').then(m => m.RenderPageModule), canActivate: [MiddlewareAtHomeGuard] },
      { path: 'chat', loadChildren: () => import('../render/render.module').then(m => m.RenderPageModule), canActivate: [MiddlewareAtHomeGuard] },
      { path: 'friends', loadChildren: () => import('../friends/friends.module').then(m => m.FriendsPageModule), canActivate: [MiddlewareAtHomeGuard] },
      { path: 'group', loadChildren: () => import('../group/group.module').then(m => m.GroupPageModule), canActivate: [MiddlewareAtHomeGuard] },
      { path: 'notification', loadChildren: () => import('../notification/notification.module').then(m => m.NotificationPageModule), canActivate: [MiddlewareAtHomeGuard] },
      { path: 'infor-user', loadChildren: () => import('../inf-user/inf-user.module').then(m => m.InfUserPageModule), canActivate: [MiddlewareAtHomeGuard] },
    ]

  },
  {
    path: 'chat',
    children: [
      { path: '', loadChildren: () => import('../msg/msg.module').then(m => m.MsgPageModule) },
      { path: ':roomName', loadChildren: () => import('../msg/msg.module').then(m => m.MsgPageModule), canActivate: [MiddlewareAtHomeGuard] }
    ],

  },


  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
