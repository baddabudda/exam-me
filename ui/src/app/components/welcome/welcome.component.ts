import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import {SubjectService } from 'src/app/services/subject.service';
import { subject, question } from '../../interfaces/interfaces';

@Component({
    selector: 'welcome',
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.less']
})

export class WelcomeComponent implements OnInit {
    search = new FormGroup({text: new FormControl('')});
    subjectListOpened = false;
    subjectListGetted = true;
    subjectList :subject[] = [];
    findQuestions: question[] = [];
    questionListOpened = false;
    error: string | null = null;

    constructor(
        private subjectService : SubjectService,
        private questionService: QuestionService ) { }
    onSubmit(event: any){
        const text = this.search.value['text'];
        if(text){
            this.questionService.findQuestion(text).subscribe(res=>{
                if(res.length){
                    this.findQuestions=res;
                    this.questionListOpened = true;}
                else{
                    this.findQuestions=[];
                    this.onError("No results found", 3000)
                    this.questionListOpened = false;
                }
            });

        }
        this.search.reset();
        
    }


    onError(text: string, duration: number = 1000){
        this.error = text;
        setTimeout(
            () => this.error = null,
            duration
        )
    }

    subgectsGet(active: boolean){
        if(this.subjectListGetted){
            this.subjectService.getSubjects().subscribe(res => {
                this.subjectList=res;
                this.subjectListOpened = active;
            })
            this.subjectListGetted = false;
        } else {
            this.subjectListOpened = active;
        }
    }

    ngOnInit() { }
}