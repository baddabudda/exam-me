import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, map, tap } from 'rxjs';
import { list, question, user } from 'src/app/interfaces/interfaces';
import { QuestionService } from 'src/app/services/question.service';
import { Location } from '@angular/common';
import {TUI_EDITOR_EXTENSIONS, TuiEditorTool, defaultEditorExtensions} from '@taiga-ui/addon-editor';
import {TuiDestroyService} from '@taiga-ui/cdk';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ListService } from 'src/app/services/list.service';

@Component({
    selector: 'selector-name',
    templateUrl: 'answer.component.html',
    styleUrls: ['answer.component.less'],
    providers: [
        TuiDestroyService,
        {
            provide: TUI_EDITOR_EXTENSIONS,
            useValue: defaultEditorExtensions
        },
    ], 
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AnswerComponent implements OnInit {
    control = new FormControl<string> ('');
    question?: question;
    builtInTools = [TuiEditorTool.Undo, TuiEditorTool.Align, TuiEditorTool.Bold, TuiEditorTool.Color, TuiEditorTool.Italic, TuiEditorTool.Quote, TuiEditorTool.Underline, TuiEditorTool.Table, TuiEditorTool.Link, TuiEditorTool.List, TuiEditorTool.HR];
    editing: boolean = false;
    public = false;
    qId: number = -1;
    user?: user;
    list?: list;
    version?: number;

    constructor(private route: ActivatedRoute,
        private questionService : QuestionService,
        private listService: ListService,
        private router: Router,
        private location: Location,
        private cdRef: ChangeDetectorRef,
        private auth: AuthService
        ) {
            auth.currentUser.subscribe(user => this.user = user ? user : undefined)
        }
    on_edit(){
        this.editing=true;
    }
    on_save(){
        if(!this.question) return;
        this.editing=false;
        console.log(this.question);
        console.log(this.question.question_body);
        this.question.question_body=this.control.value || '';
        this.questionService.putQuestion(this.question).subscribe(res=>{this.question=res; this.control.setValue(res.question_body  || '')});
        // this.questionService.putQuestion(this.question).subscribe(res=>{this.question=res; this.control.setValue(res.question_body)}, error=>this.location.back());
    }

    ngOnInit() {
        this.route.queryParams.pipe(
            tap(qParams => {
                this.public = !!qParams['public'];
                this.version = qParams['version'];
            }),
            concatMap(qp => this.route.params),
            tap(params => {
                this.qId = parseInt(params['question_id']);
                this.listService.getList(params['list_id'], this.public).subscribe(list => this.list = list);
            }),
            concatMap(params=> {
                return this.version ?
                 this.questionService.getVersions(params['list_id'], this.qId).pipe(map(versions => versions.find((v: any) => v.version_id == this.version))) : 
                 this.questionService.getQuestion( params['list_id'], this.qId, this.public)
            })
        ).subscribe(res=>{
            this.question = res;
            this.control.setValue(this.question?.question_body || '');
            this.cdRef.detectChanges();
        }, error=>this.location.back());
     }

    getAdmin(){
        return !!this.user && !!this.list && this.user.group_id == this.list.group_id
    }
    onRestore(){
        if(!this.list || !this.version) return;
        this.questionService.setVersion(this.list.list_id, this.qId, this.version).subscribe(
            res => this.router.navigate(['list', this.list?.list_id])
        )
    }
}