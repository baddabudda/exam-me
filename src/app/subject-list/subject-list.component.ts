import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../subject.service';
import { subject } from '../interfaces';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {
  subjects: subject[] =[];
  constructor(
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.subjectService.getSubjects().subscribe(subjects=>{this.subjects=subjects});
  }

}
