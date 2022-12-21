import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import {TuiAlertService} from '@taiga-ui/core';

@Component({
    selector: 'selector-name',
    templateUrl: 'login.component.html',
    styleUrls:['login.component.less']
})

export class LoginComponent implements OnInit {
    userForm = new FormGroup({
        fName: new FormControl('', Validators.required),
        lName: new FormControl('', Validators.required),
        pName: new FormControl('', Validators.required),
    })

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private auth: AuthService,
        @Inject(TuiAlertService) private readonly alertService: TuiAlertService
    ) {
        auth.currentUser.subscribe(user => {
            this.userForm.setValue({
                fName: user?.user_fname || '',
                lName: user?.user_lname || '',
                pName: user?.user_pname || ''
            })
        })
    }


    ngOnInit() {
    }

    onSubmit(){
        const controls = this.userForm.controls;
        this.auth.editProfile({
            user_fname: controls.fName.value,
            user_lname: controls.lName.value,
            user_pname: controls.pName.value,
        } as any).subscribe(res => {
            this.alertService.open('Saved', {autoClose: true}).subscribe();
            this.router.navigate(['/']);
        });
    }
}