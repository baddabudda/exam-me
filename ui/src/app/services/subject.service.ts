import { Injectable } from '@angular/core';
import { timer, of, map } from 'rxjs';
import { subject } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { HOST } from 'src/config';

@Injectable({providedIn: 'root'})
export class SubjectService {
constructor(
    private http: HttpClient,
) { }

getSubjects(){
    return this.http.get <subject[]>(`${HOST}/api/subjects`)

    // return of(subjects)
}
}

export const subjects: subject[] = [
{subject_name: 'Матан', subject_id: 0},
{subject_name: 'Теория управления', subject_id: 1},
{subject_name: 'Анализ алгоритмов', subject_id: 2},
{subject_name: 'Физика', subject_id: 3},
{subject_name: 'История', subject_id: 4},
{subject_name: 'Компьютерная графика', subject_id: 5},
{subject_name: 'Теория игр', subject_id: 6},
{subject_name: 'Теория функций комплексных переменных', subject_id: 7},
{subject_name: 'Математическая логика', subject_id: 8}
]