import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'selector-name',
    templateUrl: 'login.component.html',
    styleUrls:['login.component.less']
})

export class LoginComponent implements OnInit {
    access_token : string='';
    expires_in : number=-1;
    user_id : number=-1;
    constructor(
        private route: ActivatedRoute,
        private router: Router
        ) {
        route.fragment.subscribe(frag => {
            if(!frag){return router.navigate(['/'])}
            const [access_token, expires_in, user_id] = frag.split('&');
            let i = access_token.indexOf('=')
            if (i==-1){return router.navigate(['/'])}
            this.access_token=access_token.slice(i+1)
            i = expires_in.indexOf('=')
            if (i==-1){return router.navigate(['/'])}
            this.expires_in=Number(expires_in.slice(i+1))
            i = user_id.indexOf('=')
            if (i==-1){return router.navigate(['/'])}
            this.user_id=Number(user_id.slice(i+1))
            return
            
        })
        // console.log(window.location.hash)
        // route.queryParams.subscribe(ev=> console.log(ev));
     }

    ngOnInit() {
     }
}