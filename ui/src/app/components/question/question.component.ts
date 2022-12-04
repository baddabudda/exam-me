import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, tap } from 'rxjs';
import { subject, list, question } from 'src/app/interfaces/interfaces';
import { ListService } from 'src/app/services/list.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
    selector: 'selector-name',
    templateUrl: 'question.component.html',
    styleUrls:['question.component.less']
})

export class QuestionComponent implements OnInit {
    questions: question[]=[];
    list_id:number=-1
    list_:list={id: -1, group_name: '', subject_id: -1, subject_name: '', name: '', semestr: -1}
    constructor(private route: ActivatedRoute,
        private questionService : QuestionService,
        private listService : ListService,
        private router: Router,) {
            route.queryParams.pipe(
                tap(params=>(this.list_id=params['list_id'])),
                concatMap(params=>(this.questionService.getQuestions(this.list_id)))
            ).subscribe(res=>(this.questions=res));
            console.log(this.questions);
            this.listService.getList(this.list_id).subscribe(sub=>sub?this.list_=sub: 0);
            }

    ngOnInit() { }
}