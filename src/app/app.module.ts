import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { SettingRoomComponent } from './Component/msg/setting-room/setting-room.component';
import { AddmemberComponent } from './Component/msg/setting-room/addmember/addmember.component';
import { NicknamesComponent } from './Component/msg/setting-room/nicknames/nicknames.component';
import { MiddlewareGuard } from './guard/middleware.guard';
import { MiddlewareAtHomeGuard } from './guard/middleware-at-home.guard';



@NgModule({
  declarations: [AppComponent, SettingRoomComponent, AddmemberComponent, NicknamesComponent],
  entryComponents: [ SettingRoomComponent, AddmemberComponent, NicknamesComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ReactiveFormsModule],
  providers: [
    // MiddlewareAtHomeGuard,
    // MiddlewareGuard,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
