import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MiddlewareGuard } from './guard/middleware.guard';

const routes: Routes = [

  { path: 'login', loadChildren: () => import('./Component/login/login.module').then( m => m.LoginPageModule)},
 
  { path: 'home', loadChildren: () => import('./Component/home/home.module').then( m => m.HomePageModule), canActivate: [MiddlewareGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full'},

     {
     path: 'signup',
     loadChildren: () => import('./Component/sign-up/sign-up.module').then( m => m.SignUpPageModule)
   },
   {
     path: 'signup',
     loadChildren: () => import('./Component/sign-up/sign-up.module').then( m => m.SignUpPageModule)
   },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
