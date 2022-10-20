import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { question } from '../interfaces';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  id?: string;
  question?: question;
  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    route.paramMap.subscribe(params=>{
      let Qid = params.get('Qid');
      let Sid = params.get('Sid');
      if(Qid && Sid){
        this.id=Qid;
        this.questionService.getQuestion(Sid, Qid).subscribe(
          question=>{this.question=question},
          error=>{console.log(error);
            router.navigate([`/subject/${Sid}`])}
          )
      }
    }

    )
  }

  ngOnInit(): void {

  }

}