import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { MiddlewareAtHomeGuard } from '../../guard/middleware-at-home.guard';


const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {path: '',     loadChildren: () => import('../render/render.module').then( m => m.RenderPageModule), canActivate: [MiddlewareAtHomeGuard] },
      {path: 'vv', loadChildren: () => import('../render/render.module').then( m => m.RenderPageModule), canActivate: [MiddlewareAtHomeGuard]},
      {path: 'acceptFriend', loadChildren: () => import('../invite-friend/invite-friend.module').then( m => m.InviteFriendPageModule), canActivate: [MiddlewareAtHomeGuard]},
      {path: 'notification', loadChildren: () => import('../notification/notification.module').then( m => m.NotificationPageModule), canActivate: [MiddlewareAtHomeGuard]},
      
    ]
    
  },
 // { path: 'chat/: roomName', loadChildren: () => import('../msg/msg.module').then(m => m.MsgPageModule)},
  {
    path: 'chat',
    children: [
      { path: '', loadChildren: () => import('../msg/msg.module').then(m => m.MsgPageModule)},
      { path: ':roomName', loadChildren: () => import('../msg/msg.module').then(m => m.MsgPageModule), canActivate: [MiddlewareAtHomeGuard]}
  ],

},
  {path: 'infor-user', loadChildren: () => import('../inf-user/inf-user.module').then(m => m.InfUserPageModule), canActivate: [MiddlewareAtHomeGuard]},
  
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
export class HomePageRoutingModule {}
