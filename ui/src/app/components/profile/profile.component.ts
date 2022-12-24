import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, tap } from 'rxjs';
import { Group, user } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';

@Component({
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['./profile.component.less', '../subject/subject.component.less']
})

export class ProfileComponent implements OnInit {

    user?: user;
    group?: Group;

    constructor(
        private auth: AuthService,
        private groupService: GroupService,
        private router: Router
    ) { 
        auth.currentUser.pipe(
            tap(user => this.user = user ? user : undefined),
            concatMap(user =>  groupService.getGroup())
        ).subscribe(group => this.group = group);
    }

    ngOnInit() { }

    getGroupName(){
        return this.group ? this.group.group_name : 'Unknown'
    }
    getRole(){
        if(!this.group)return undefined;
        const admin = (this.group && this.user) && this.group.group_admin == this.user.user_id;
        return `${admin ? "Староста" : "Участник"} группы`
    }
    logout(){
        this.auth.logout().subscribe(res => this.router.navigate(['/']));
    }
}