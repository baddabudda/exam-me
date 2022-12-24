import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HOST } from 'src/config';
import { list, question } from '../interfaces/interfaces';
import { getHttpOptions } from './auth.service';

@Injectable({providedIn: 'root'})
export class QuestionService {
    constructor(
        private http: HttpClient
    ) { }
    getQuestions(list_id: number, pub: boolean = false){
        return this.http.get<question[]>(`${HOST}/api/lists/${pub ? 'public/' : ''}${list_id}/all`, getHttpOptions())
    }
    // TODO list_id check
    getQuestion(list_id: number, question_id: number, pub: boolean = false){
        return this.http.get<question>(`${HOST}/api/lists/${pub ? "public/" : ''}${list_id}/${question_id}/`, getHttpOptions())
    }

    postQuestion(list_id: number, question: question){
        return this.http.post<question>(`${HOST}/api/lists/${list_id}/create`, question, getHttpOptions())
    }
    putQuestion(question: question){
        return this.http.put<question>(`${HOST}/api/lists/${question.list_id}/${question.question_id}/edit`, question, getHttpOptions())
    }

    deleteQuestion(list_id: number, question_id: number){
        return this.http.delete<question>(`${HOST}/api/lists/${list_id}/${question_id}/`, getHttpOptions())
    }

    findQuestions(searchString: string){
        return this.http.get<question[]>(`${HOST}/api/search?question=${encodeURIComponent(searchString.toLowerCase())}`)
    }

    orderChange(listid: number, orders: any){
        return this.http.put<question>(`${HOST}/api/lists/${listid}/order_edit`, orders, getHttpOptions())
    }

    getVersions(list_id: number,  question_id: number){
        return this.http.get<question[]>(`${HOST}/api/lists/${list_id}/${question_id}/versions`, getHttpOptions())
    }
    setVersion(list_id: number, question_id: number, version_id: number){
        return this.http.put(`${HOST}/api/lists/${list_id}/${question_id}/${version_id}`, {list_id, question_id, version_id}, getHttpOptions())
    }
}