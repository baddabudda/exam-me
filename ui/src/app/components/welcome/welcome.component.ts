import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { subject, SubjectService } from 'src/app/services/subject.service';

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

    constructor(private subjectService : SubjectService) { }
    onSubmit(event: any){
        console.log(this.search.controls.text.value);
        this.search.reset();
    }
    subgectsGet(){
        if(this.subjectListGetted){
            this.subjectService.getSubjects().subscribe(res => this.subjectList=res)
            this.subjectListGetted = false
        }
    }

    ngOnInit() { }
}