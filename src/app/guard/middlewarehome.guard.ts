import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatServicesService } from '../Component/Services/chat-services.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
//, CanActivateChild, CanLoad
export class MiddlewareHomeGuard implements CanActivate {
  constructor(private _services: ChatServicesService, private router: Router){}
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean >  {
     const res= await this._services.middleWare();
     if(res.stt) {
      this.router.navigate(['/home']);
       return false;
     }
    //  this.router.navigate(['/login']);
      return true;
  }
  // canActivateChild(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
      
  // }
  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
  //   return true;
  // }
}
