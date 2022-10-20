import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { subject, question } from './interfaces';
import { Observable, of, throwError } from 'rxjs';
import { question_list, subject_list } from './mock';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<subject[]>{
    return of(subject_list)
  }
  getSubject(id: string): Observable<subject>{
    let subject = subject_list.find(subject=>subject.id==id);
    return subject ? of(subject) : throwError('not found');
  }
}



