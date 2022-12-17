import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { list } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { HOST } from 'src/config';

@Injectable({providedIn: 'root'})
export class ListService {
    constructor(
        private http: HttpClient,
    ) { }
    getLists(subject_id: number){
        return this.http.get<list[]>(`${HOST}/api/list/public/${subject_id}`)
        // return(of(lists.filter(list=>(list.subject_id==subject_id))))

    }
    getList(list_id: number){
        return this.http.get<list>(`${HOST}/api/list/${list_id}`)
        // const res = lists.find(list=>(list.id==list_id));
        // return res?of(res):throwError(()=>'not found')

    }
    
}
// export const lists: list[]=[
//     {id: 0, group_name: '20.Б12-ПУ', subject_name: 'Матан', subject_id: 0, name:'Матан1', semestr:2 },
//     {id: 1, group_name: '20.Б11-ПУ', subject_name: 'Матан', subject_id: 0, name:'Матан2', semestr:3 },
//     {id: 2, group_name: '20.Б13-ПУ', subject_name: 'Матан', subject_id: 0, name:'Матан3', semestr:1 },
//     {id: 3, group_name: '20.Б12-ПУ', subject_name: 'Теория управления', subject_id: 1, name:'Теория управления1', semestr:1 },
//     {id: 4, group_name: '20.Б13-ПУ', subject_name: 'Теория управления', subject_id: 1, name:'Теория управления2', semestr:2 },
//     {id: 5, group_name: '20.Б15-ПУ', subject_name: 'Анализ алгоритмов', subject_id: 2, name:'Анализ алгоритмов1' , semestr:4},
//     {id: 6, group_name: '20.Б12-ПУ', subject_name: 'Анализ алгоритмов', subject_id: 2, name:'Анализ алгоритмов2', semestr:4 },
//     {id: 7, group_name: '20.Б19-ПУ', subject_name: 'Физика', subject_id: 3, name:'физика', semestr:2 }
// ]
