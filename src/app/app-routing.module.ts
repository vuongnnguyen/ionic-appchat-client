import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MiddlewareGuard } from './guard/middleware.guard';

const routes: Routes = [

  { path: 'login', loadChildren: () => import('./Component/login/login.module').then( m => m.LoginPageModule)},
 
  { path: 'home', loadChildren: () => import('./Component/home/home.module').then( m => m.HomePageModule), canActivate: [MiddlewareGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
//   {
//     path: 'chat',
//     children: [
//       { path: '', loadChildren: () => import('./Component/msg/msg.module').then(m => m.MsgPageModule)},
//       { path: ':roomName', loadChildren: () => import('./Component/msg/msg.module').then(m => m.MsgPageModule)}
//   ]
// },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },   {
    path: 'change-pass',
    loadChildren: () => import('./Component/change-pass/change-pass.module').then( m => m.ChangePassPageModule)
  },
  {
    path: 'forgot-passprivate',
    loadChildren: () => import('./Component/forgot-passprivate/forgot-passprivate.module').then( m => m.ForgotPassprivatePageModule)
  },

  // {
  //   path: 'inf-user',
  //   loadChildren: () => import('./Component/inf-user/inf-user.module').then( m => m.InfUserPageModule)
  // }
  // {
  //   path: 'login',
  //   loadChildren: () => import('./Component/login/login.module').then( m => m.LoginPageModule)
  // },
  // {
  //   path: 'signin',
  //   loadChildren: () => import('./Component/sign-in/sign-in.module').then( m => m.SignInPageModule)
  // },
  // {
  //   path: 'signup',
  //   loadChildren: () => import('./Component/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  // },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./Component/home/home.module').then( m => m.HomePageModule)
  // },
  // {
  //   path: 'msg',
  //   loadChildren: () => import('./Component/msg/msg.module').then( m => m.MsgPageModule)
  // },
  // {
  //   path: 'render',
  //   loadChildren: () => import('./Component/render/render.module').then( m => m.RenderPageModule)
  // },
  // {
  //   path: 'seach',
  //   loadChildren: () => import('./Component/render/seach/seach.module').then( m => m.SeachPageModule)
  // },
  // {
  //   path: 'notification',
  //   loadChildren: () => import('./Component/notification/notification.module').then( m => m.NotificationPageModule)
  // },
  // {
  //   path: 'invite-friend',
  //   loadChildren: () => import('./Component/invite-friend/invite-friend.module').then( m => m.InviteFriendPageModule)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
