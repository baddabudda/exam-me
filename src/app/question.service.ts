import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { question } from './interfaces';
import { Observable, of, throwError } from 'rxjs';
import {subject_list, question_list} from './mock';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(
    private http: HttpClient
  ) { }
  getQuestions(): Observable<question[]>{
    return of(question_list)
  }
  getQuestion(Sid: string, Qid: string): Observable<question>{
    let subject = subject_list.find(subject=>subject.id==Sid);
    let question;
    if (subject!=undefined){
      question = subject.question_List.find(question=>question.id==Qid);}
    return (subject && question) ? of(question) : throwError('not found');
  }
}

