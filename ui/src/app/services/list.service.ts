import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { list } from '../interfaces/interfaces';

@Injectable({providedIn: 'root'})
export class ListService {
    constructor() { }
    getLists(subject_id: number){
        return(of(lists.filter(list=>(list.subject_id==subject_id))))

    }
    
}
export const lists: list[]=[
    {id: 0, group_name: '20.Б12-ПУ', subject_name: 'Матан', subject_id: 0, name:'Матан1' },
    {id: 1, group_name: '20.Б11-ПУ', subject_name: 'Матан', subject_id: 0, name:'Матан2' },
    {id: 2, group_name: '20.Б13-ПУ', subject_name: 'Матан', subject_id: 0, name:'Матан3' },
    {id: 3, group_name: '20.Б12-ПУ', subject_name: 'Теория управления', subject_id: 1, name:'Теория управления1' },
    {id: 4, group_name: '20.Б13-ПУ', subject_name: 'Теория управления', subject_id: 1, name:'Теория управления2' },
    {id: 5, group_name: '20.Б15-ПУ', subject_name: 'Анализ алгоритмов', subject_id: 2, name:'Анализ алгоритмов1' },
    {id: 6, group_name: '20.Б12-ПУ', subject_name: 'Анализ алгоритмов', subject_id: 2, name:'Анализ алгоритмов2' },
    {id: 7, group_name: '20.Б19-ПУ', subject_name: 'Физика', subject_id: 3, name:'физика' }
]
