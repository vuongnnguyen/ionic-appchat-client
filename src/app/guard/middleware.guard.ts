import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatServicesService } from '../Component/Services/chat-services.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
//, CanActivateChild, CanLoad 
export class MiddlewareGuard implements CanActivate {
  constructor(private _services: ChatServicesService, private router: Router){}
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean >  {
     const res= await this._services.middleWare()
     if(!res.stt) {
      this.router.navigate(['/login']);
       return false;
     }
    
    //  this.router.navigate(['/login']);
    this._services.user= res.user;
    this._services.socket.emit('Client-join-room', res.user.room );
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
