import { ChangeDetectorRef, Component, Host, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { question, user } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { QuestionService } from 'src/app/services/question.service';
import { Vk_App_Id } from 'src/config';
import { HOST } from 'src/config';

@Component({
    selector: 'toolbar',
    templateUrl: 'toolbar.component.html',
    styleUrls: ['toolbar.component.less']
})

export class ToolbarComponent implements OnInit {
    search = new FormGroup({text: new FormControl('')});
    toolbar_hide: boolean = false;
    bottombar_hide: boolean = false;
    findQuestions: question[] = [];
    questionListOpened = false;
    error: string | null = null;
    user?: user;
    vk_auth_link: string = `${HOST}/auth/vk`

    constructor(
        private router: Router,
        private questionService: QuestionService,
        private route: ActivatedRoute,
        private cdRef: ChangeDetectorRef,
        private authService: AuthService

    ) {
        authService.currentUser.subscribe(ev => this.user = ev ? ev : undefined)
        router.events.subscribe(ev=>{
        if(ev instanceof NavigationEnd){
            if(ev.url.includes('login') || ev.url.includes('registrate')){this.bottombar_hide=true; this.toolbar_hide=true}
            else{
                if(ev.url=='/' || ev.url.includes('welcome')){this.bottombar_hide=true; this.toolbar_hide=false}
                else{
                    this.bottombar_hide=false; 
                    this.toolbar_hide=false;}
                }
        }
    }) }

    redirect(link: string){
        this.router.navigate([link])
    }
    onSubmit(event: any){
        const text = this.search.value['text'];
        if(text){
            this.questionService.findQuestion(text).subscribe(res=>{
                if(res.length){
                    this.findQuestions=res;
                    this.questionListOpened = true;}
                else{
                    this.findQuestions=[];
                    this.onError("No results found", 3000)
                    this.questionListOpened = false;
                }
            });

        }
        this.search.reset();
        
    }


    onError(text: string, duration: number = 1000){
        this.error = text;
        setTimeout(
            () => this.error = null,
            duration
        )
    }

    getVkOuthLink(){
        return `https://oauth.vk.com/authorize?client_id=${Vk_App_Id}&display=popup&redirect_uri=${window.location.origin}/login&scope=&response_type=token&v=5.59`
    }


    ngOnInit() { }
}