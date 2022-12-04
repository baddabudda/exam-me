import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'selector-name',
    templateUrl: 'subject.component.html',
    styleUrls: ['subject.component.less']
})

export class SubjectComponent implements OnInit {
    sub_id?:string;
    constructor(private route: ActivatedRoute) {
        route.params.subscribe(params=> this.sub_id=params['sub_id'])
     }

    ngOnInit() { }
}