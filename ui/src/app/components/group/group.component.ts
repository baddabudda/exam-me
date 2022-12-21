import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/interfaces/interfaces';
import { GroupService } from 'src/app/services/group.service';

@Component({
    selector: 'group',
    templateUrl: 'group.component.html',
    styleUrls: ['./group.component.less', '../subject/subject.component.less']
})

export class GroupComponent implements OnInit {

    group?: Group;

    constructor(
        private groupService: GroupService
    ) { 
        groupService.getGroup().subscribe(gr => this.group = gr);
    }

    ngOnInit() { }
}