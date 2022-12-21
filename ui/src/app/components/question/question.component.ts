import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, of, tap } from 'rxjs';
import { subject, list, question, user } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { ListService } from 'src/app/services/list.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
    selector: 'selector-name',
    templateUrl: 'question.component.html',
    styleUrls:['../subject/subject.component.less']
})

export class QuestionComponent implements OnInit {
    questions: question[]=[];
    list_id:number=-1;
    public = false;
    list_?:list;
    user?: user;
    questionCreation: boolean = false;
    newQuest = new FormGroup({
        name: new FormControl('', Validators.required),
        })


    constructor(private route: ActivatedRoute,
        private questionService : QuestionService,
        private listService : ListService,
        private router: Router,
        private auth: AuthService
        ) 
    {
        auth.currentUser.subscribe(user => this.user = user ? user : undefined)
        route.params.pipe(
            tap(params=>this.list_id=params['list_id']),
            concatMap(params => route.queryParams),
            tap(qParams => this.public = !!qParams['public']),
            tap(qParams => {
                if(this.list_id)
                this.listService.getList(this.list_id,  this.public).subscribe(
                    sub=>{
                        console.log(sub),
                        this.list_ = sub;
                    },
                    error=>router.navigate(['/subject'])
                );
            }),
            concatMap(qParams=> this.list_id ? this.questionService.getQuestions(this.list_id, this.public) : of([])
            )
        ).subscribe(res=>{
            this.questions=res.sort((a, b)=>a.question_order-b.question_order);
        });
    }

    ngOnInit() { }

    getAdmin(){
        return !!this.user && !!this.list_ && this.user.group_id == this.list_.group_id
    }
    addQuestion(){
        if(!this.list_id) return;
        this.questionCreation = false;
        this.questionService.postQuestion(this.list_id, {
            question_title: this.newQuest.controls.name.value,
            question_body: ' ',
            question_order: this.questions.length + 1,
            list_id: this.list_id,
            is_deleted: false  
        } as question).subscribe(res => window.location.reload());
    }
    deleteQuestion(question_id: number){
        if(!this.list_id) return;
        this.questionService.deleteQuestion(this.list_id, question_id).subscribe(res => {
            const idx = this.questions.findIndex(q => q.question_id == question_id);
            if(idx != -1)
                this.questions.splice(idx, 1);
        })
    }
}