import { Injectable } from '@angular/core';
import { timer, of, map } from 'rxjs';
export interface subject{
name: string,
id: number
}

@Injectable({providedIn: 'root'})
export class SubjectService {
constructor() { }

getSubjects(){

    return timer(1000).pipe(map(() => {
        console.log('req')
        return subjects
    }));
}
}

export const subjects: subject[] = [
{name: 'Матан', id: 0},
{name: 'Теория управления', id: 1},
{name: 'Анализ алгоритмов', id: 2},
{name: 'Физика', id: 3},
{name: 'История', id: 4},
{name: 'Компьютерная графика', id: 5},
{name: 'Теория игр', id: 6},
{name: 'Теория функций комплексных переменных', id: 7}
]