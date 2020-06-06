import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zola',
  templateUrl: './zola.page.html',
  styleUrls: ['./zola.page.scss'],
})
export class ZolaPage implements OnInit {

  constructor(private router :Router) { }

  ngOnInit() {
  }
  withlogin(){
    this.router.navigate(["/login"]);
  }
  withsignup(){
   this.router.navigate(["/signup"])
  }
}
