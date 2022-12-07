import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { question } from '../interfaces/interfaces';

@Injectable({providedIn: 'root'})
export class QuestionService {
    constructor() { }
    getQuestions(list_id: number){
        return(of(questions.filter(question=>(question.list_id==list_id))))
    }
    // TODO list_id check
    getQuestion(question_id: number){
        const res = (questions.find(question=>(question.id==question_id)));
        return(res?of(res):throwError(()=>'not found'))
    }
    putQuestion(ques: question){
        const ind = questions.findIndex(question=>(question.id==ques.id));
        if(ind==-1){
            return(throwError(()=>'not found'))
        }
        return of(questions[ind]=ques);
    }

    findQuestion(naming: string){
        const search = naming.toLowerCase()
        const res = questions.filter(question=>(question.name.toLowerCase().includes(search)));
        return of(res);
    }

    }
    
export const questions: question[] = [
    {id: 0, name: 'Вычисление площадей с помощью определенного интеграла.', list_id: 0,  last_change:'2022-05-11T17:45:59.453Z', order: 1, body: 'aaaaaaaaaaa'},
    {id: 1, name: 'Полярные координаты. Вычисление площадей в полярных координатах.', list_id: 0,  last_change:'04.12.2022', order: 2, body: ''},
    {id: 2, name: 'Вычисление объемов с помощью определенного интеграла.', list_id: 0,  last_change:'04.12.2022', order: 3, body: ''},
    {id: 3, name: 'Длина кривой. Случай явного и параметрического задания кривой.', list_id: 1,  last_change:'04.12.2022', order: 1, body: ''},
    {id: 4, name: 'Длина кривой в полярных координатах.', list_id: 1,  last_change:'04.12.2022', order: 2, body: ''},
    {id: 5, name: 'Площадь поверхности вращения.', list_id: 2,  last_change:'04.12.2022', order: 1, body: ''},
    {id: 6, name: 'Аффинные евклидовы пространства.', list_id: 7,  last_change:'04.12.2022', order: 1, body: ''},
    {id: 7, name: 'Аффинные координаты и преобразования.', list_id: 7,  last_change:'04.12.2022', order: 2, body: ''},
    {id: 8, name: 'Криволинейные системы координат.', list_id: 7,  last_change:'04.12.2022', order: 3, body: ''},
    {id: 9, name: 'Локальные базисы криволинейных координат.', list_id: 7,  last_change:'04.12.2022', order: 4, body: ''},
    {id: 10, name: 'Коэффициенты Ламе. Проекции скорости точки на оси криволинейной системы координат', list_id: 7,  last_change:'04.12.2022', order: 5, body: ''},
    
]