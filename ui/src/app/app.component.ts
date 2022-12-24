import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HOST } from 'src/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'exam_me';
  constructor(
    private router: Router,
    private http: HttpClient,
  ){
    router.events.subscribe(ev=>{if(ev instanceof NavigationEnd) window.scrollTo(0, 0)})
  }
  delete(){
    return this.http.delete(`${HOST}/api/subjects/16`).subscribe(console.log)
  }

}
