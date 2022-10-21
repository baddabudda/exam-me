import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../subject.service';
import { subject } from '../interfaces';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {
  subjects: subject[] =[];
  showList: boolean = false;
  searchForm=new FormGroup({
    search: new FormControl('')
  })
  constructor(
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.subjectService.getSubjects().subscribe(subjects=>{this.subjects=subjects});
  }
  onSubmit(event: any){
    
  }

}
