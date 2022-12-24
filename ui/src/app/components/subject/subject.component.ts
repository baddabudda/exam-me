import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, concatMap, of, tap } from 'rxjs';
import { subject, list } from 'src/app/interfaces/interfaces';
import { ListService } from 'src/app/services/list.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
    selector: 'selector-name',
    templateUrl: 'subject.component.html',
    styleUrls: ['subject.component.less']
})

export class SubjectComponent implements OnInit {
    sub_id?:number;
    subjects: subject[] = [];
    lists: list[]=[];
    constructor(
        private route: ActivatedRoute,
        private subjectService : SubjectService,
        private listService : ListService,
        private router: Router,
        ) {
        this.subjectService.getSubjects().subscribe(sub=>this.subjects=sub);
        route.queryParams.pipe(
            tap(params=>(this.sub_id=params['sub_id'])),
            concatMap(params=> this.sub_id ? this.listService.getLists(this.sub_id) : of(null))
        ).subscribe(res=> this.lists=res ? res : []);
        }
        subject_choose(s_id?: number){
            this.router.navigate([], {queryParams: (s_id != undefined) ? { sub_id : s_id} : {}})

        }


    ngOnInit() { }
}

