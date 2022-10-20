import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { subject} from '../interfaces';
import { SubjectService } from '../subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  id?: string;
  subject?: subject;
  constructor(
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private router: Router
  ) 
  { route.paramMap.subscribe(params=>{
    let Sid = params.get('Sid');
    if(Sid){
      this.id=Sid;
      this.subjectService.getSubject(Sid).subscribe(
        subject=>{this.subject=subject},
        error=>{router.navigate(['/subjects'])}
        )
    }
  }
  )}

  ngOnInit(): void {
  }

}
