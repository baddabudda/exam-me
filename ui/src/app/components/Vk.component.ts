import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Vk_App_Id } from 'src/config';
import { AuthService } from '../services/auth.service';

declare var VK:any;

@Component({
    selector: 'vk-api',
    template: '<div id="vk_auth"></div>'
})

export class VkComponent implements OnInit{
    constructor(
        private renderer: Renderer2,
        private authService: AuthService
        ) { }

    ngOnInit() { 
        const script = this.renderer.createElement('script');
        script.src="https://vk.com/js/api/openapi.js?169";
        script.async=true; 
        script.onload= () => this.onLoad();
        this.renderer.appendChild(document.head, script);
        
    }

    onLoad(){
        VK.init({
            apiId: `${Vk_App_Id}`
        })

        VK.Auth.getLoginStatus((session: any) => {
        console.log(session)
        if(session.status=='connected'){
            console.log(session.session.user.id)
            this.authService.setUser({id: Number(session.session.user.id),
                name: session.session.user.first_name,
                Lastname: session.session.user.last_name,
                Fname: session.session.user.nickname,
                group_id: 0,
                sid: session.session.sid
            });
        
        }
        else{this.authService.setUser(null)}

    }, {});

    }

}