import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { GroupService } from '../services/group.service';

@Component({
    selector: 'join',
    template: ``
})

export class JoinComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthService,
        private groupService: GroupService,
        @Inject(TuiAlertService) private readonly alertService: TuiAlertService
    ) { 
        auth.currentUser.pipe(
            tap(user => {
                if(!user){
                    this.alert('Сначала нужно войти в аккаунт!', true);
                    this.router.navigate(['/']);
                }
            }),
            switchMap(user => user ? route.params : of(null))
        ).subscribe(params => {
            if(!params) return;
            const token = params['token'];
            if(!token) this.router.navigate(['/']);
            this.joinGroup(token);
        })
    }

    ngOnInit() { }

    alert(message: string, error: boolean = false){
        this.alertService.open(message, {autoClose: true, status: error ? TuiNotification.Error : TuiNotification.Success}).subscribe();
    }
    joinGroup(token: string){
        this.groupService.joinGroup(token).pipe(
            catchError(error => {
                console.log(error);
                this.alert('Что-то пошло не так!', true);
                this.router.navigate(['/']);
                return of(false);
            })
        ).subscribe(res => {
            if(!res) return;
            this.alert('Вы успешно присоединились к группе!', false);
            window.location.href='/group';
        })
    }
}