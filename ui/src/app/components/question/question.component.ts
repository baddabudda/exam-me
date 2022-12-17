import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, tap } from 'rxjs';
import { subject, list, question } from 'src/app/interfaces/interfaces';
import { ListService } from 'src/app/services/list.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
    selector: 'selector-name',
    templateUrl: 'question.component.html',
    styleUrls:['../subject/subject.component.less']
})

export class QuestionComponent implements OnInit {
    questions: question[]=[];
    list_id:number=-1
    list_?:list;
    constructor(private route: ActivatedRoute,
        private questionService : QuestionService,
        private listService : ListService,
        private router: Router) {
            route.params.pipe(
                tap(params=>(this.list_id=params['list_id'])),
                concatMap(params=>(this.questionService.getQuestions(this.list_id)))
            ).subscribe(res=>(this.questions=res.sort((a, b)=>a.order-b.order)));
            this.listService.getList(this.list_id).subscribe(sub=>this.list_=sub, error=>router.navigate(['/subject']));
            }

    ngOnInit() { }
}