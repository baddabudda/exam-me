import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'exam_me';
  constructor(
    private router: Router,
  ){
    router.events.subscribe(ev=>{if(ev instanceof NavigationEnd) window.scrollTo(0, 0)})
  }
}
