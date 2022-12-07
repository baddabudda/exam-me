import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap } from 'rxjs';
import { question } from 'src/app/interfaces/interfaces';
import { QuestionService } from 'src/app/services/question.service';
import { Location } from '@angular/common';
import {TUI_EDITOR_EXTENSIONS, TuiEditorTool} from '@taiga-ui/addon-editor';
import {TuiDestroyService} from '@taiga-ui/cdk';
import { FormControl } from '@angular/forms';

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
    question: question = {id: -1, name: '', list_id: -1,  last_change:'', order: -1, body: ''};
    builtInTools = [TuiEditorTool.Undo, TuiEditorTool.Group];
    editing: boolean = false;

    constructor(private route: ActivatedRoute,
        private questionService : QuestionService,
        private router: Router,
        private location: Location) {
            route.params.pipe(
                concatMap(params=>(this.questionService.getQuestion(params['question_id'])))
            ).subscribe(res=>{this.question=res; this.control.setValue(res.body)}, error=>location.back());
            }
    on_edit(){
        this.editing=true;
    }
    on_save(){
        this.editing=false;
        this.question.body=this.control.value || '';
        this.questionService.putQuestion(this.question).subscribe(res=>{this.question=res; this.control.setValue(res.body)}, error=>this.location.back());
    }

    ngOnInit() { }
}