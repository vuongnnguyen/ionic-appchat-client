import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MiddlewareGuard } from './guard/middleware.guard';
import { MiddlewareHomeGuard } from './guard/middlewarehome.guard';

const routes: Routes = [

  {
    path: 'login',
    loadChildren: () => import('./Component/login/login.module').then(m => m.LoginPageModule), canActivate: [MiddlewareHomeGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./Component/home/home.module').then(m => m.HomePageModule), canActivate: [MiddlewareGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./Component/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'zola',
    loadChildren: () => import('./Component/zola/zola.module').then(m => m.ZolaPageModule) ,canActivate: [MiddlewareGuard]
  },
  {
    path: 'acceptFriend',
    loadChildren: () => import('./Component/invite-friend/invite-friend.module').then(m => m.InviteFriendPageModule)
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./Component/forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordPageModule)
  },
  {
    path: 'friends',
    loadChildren: () => import('./Component/friends/friends.module').then(m => m.FriendsPageModule)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
