import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { concatMap, of, tap } from 'rxjs';
import { subject, list, question, user, Group } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
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
        order: new FormControl(0, [Validators.required, Validators.min(0)])
        })
    group?: Group;

    orderEditing = false;
    constructor(private route: ActivatedRoute,
        private questionService : QuestionService,
        private listService : ListService,
        private groupService: GroupService,
        private router: Router,
        private auth: AuthService,
        @Inject(TuiAlertService) private readonly alertService: TuiAlertService
        ) 
    {
        auth.currentUser.pipe(
            tap(user => this.user = user ? user : undefined),
            concatMap(user => user ? groupService.getGroup() : of(null))
        ).subscribe(group => {
            if(!group) return;
            this.group = group;
        })

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
            console.log(res)
            this.questions=res.filter(q => !q.is_deleted).sort((a, b)=>a.question_order-b.question_order);
        });
    }

    ngOnInit() { }

    get isAdmin(){
        if(!this.list_ || !this.group || !this.user) return false;
        return( this.list_.group_id == this.group.group_id) && (this.user.user_id == this.group.group_admin);
    }

    getEditor(){
        return !!this.user && !!this.list_ && this.user.group_id == this.list_.group_id
    }

    onNewQuestion(){
        this.questionCreation = true;
        this.newQuest.patchValue({
            order: (this.questions.at(-1)?.question_order || this.questions.length) + 1
        })
    }

    addQuestion(){
        if(!this.list_id) return;

        if(this.questions.map(q => q.question_order).includes(this.newQuest.controls.order.value || -1)){
            this.alertService.open('Убедитесь что все порядковые номера уникальны', {autoClose: true, status: TuiNotification.Error}).subscribe();
            return;
        }

        this.questionCreation = false;
        this.questionService.postQuestion(this.list_id, {
            question_title: this.newQuest.controls.name.value,
            question_body: ' ',
            question_order: this.newQuest.controls.order.value,
            list_id: this.list_id,
            is_deleted: false  
        } as question).subscribe(res => window.location.reload());
    }
    // deleteQuestion(question_id: number){
    //     if(!this.list_id) return;
    //     this.questionService.deleteQuestion(this.list_id, question_id).subscribe(res => {
    //         const idx = this.questions.findIndex(q => q.question_id == question_id);
    //         if(idx != -1)
    //             this.questions.splice(idx, 1);
    //     })
    // }
    onPublish(){
        if(!this.list_id || !this.list_ || !this.list_.group_id) return;
        this.listService.publishList(this.list_id, this.list_.group_id).subscribe(res => window.location.reload())
    }
    onDeleteQuestion(questionId: number){
        if(!this.list_id) return;
        this.questionService.deleteQuestion(this.list_id, questionId).subscribe(res => window.location.reload())
    }

    onEditOrder(){
        this.orderEditing = true;
    }

    onSaveOrder(){
        if(!this.list_id) return;

        if( this.questions.length != [... new Set( this.questions.map(q => q.question_order) )].length ){
            this.alertService.open('Убедитесь что все значения уникальны', {autoClose: true, status: TuiNotification.Error}).subscribe();
            return;
        }

        const orders = {
            list_id: this.list_id,
            orders: this.questions.map(q => ({question_id: q.question_id, order: q.question_order || 0}))
        }
        
        this.questionService.orderChange(this.list_id ,orders).subscribe(res => window.location.reload())

        console.log(orders)
    }
}