import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, tap } from 'rxjs';
import { list, question, user } from 'src/app/interfaces/interfaces';
import { QuestionService } from 'src/app/services/question.service';
import { Location } from '@angular/common';
import {TUI_EDITOR_EXTENSIONS, TuiEditorTool} from '@taiga-ui/addon-editor';
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
            useValue: [
                import(`@taiga-ui/addon-editor/extensions/starter-kit`).then(
                    ({StarterKit}) => StarterKit,
                ),
                import(`@tiptap/extension-placeholder`).then(({Placeholder}) =>
                    Placeholder.configure({
                        emptyNodeClass: `t-editor-placeholder`,
                        placeholder: `Type '/' for command`, // Notion like
                        includeChildren: true,
                    }),
                ),
                import(`@taiga-ui/addon-editor/extensions/group`).then(
                    ({createGroupExtension}) =>
                        createGroupExtension({nested: false, createOnEnter: true}),
                ),
            ],
        },
    ], 
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AnswerComponent implements OnInit {
    control = new FormControl<string> ('');
    question?: question;
    builtInTools = [TuiEditorTool.Undo, TuiEditorTool.Group];
    editing: boolean = false;
    public = false;
    qId: number = -1;
    user?: user;
    list?: list;

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
        this.question.question_body=this.control.value || '';
        this.questionService.putQuestion(this.question).subscribe(res=>{this.question=res; this.control.setValue(res.question_body)}, error=>this.location.back());
    }

    ngOnInit() {
        this.route.queryParams.pipe(
            tap(qParams => this.public = !!qParams['public']),
            concatMap(qp => this.route.params),
            tap(params => {
                this.qId = parseInt(params['question_id']);
                this.listService.getList(params['list_id'], this.public).subscribe(list => this.list = list);
            }),
            concatMap(params=>this.questionService.getQuestions( params['list_id'], this.public))
        ).subscribe(res=>{
            this.question = res.find(q => q.question_id == this.qId) as question; 
            this.control.setValue(this.question.question_body);
            this.cdRef.detectChanges();
        }, error=>this.location.back());
     }

    getAdmin(){
        return !!this.user && !!this.list && this.user.group_id == this.list.group_id
    }
}