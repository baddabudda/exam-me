import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { question } from '../interfaces/interfaces';

@Injectable({providedIn: 'root'})
export class QuestionService {
    constructor() { }
    getQuestions(list_id: number){
        return(of(questions.filter(question=>(question.list_id==list_id))))

    }
    }
    
export const questions: question[] = [
    {id: 0, name: 'Вычисление площадей с помощью определенного интеграла.', list_id: 0,  last_change:'04.12.2022'},
    {id: 1, name: 'Полярные координаты. Вычисление площадей в полярных координатах.', list_id: 0,  last_change:'04.12.2022'},
    {id: 2, name: 'Вычисление объемов с помощью определенного интеграла.', list_id: 0,  last_change:'04.12.2022'},
    {id: 3, name: 'Длина кривой. Случай явного и параметрического задания кривой.', list_id: 1,  last_change:'04.12.2022'},
    {id: 4, name: 'Длина кривой в полярных координатах.', list_id: 1,  last_change:'04.12.2022'},
    {id: 5, name: 'Площадь поверхности вращения.', list_id: 2,  last_change:'04.12.2022'},
    {id: 6, name: 'Аффинные евклидовы пространства.', list_id: 3,  last_change:'04.12.2022'},
    {id: 7, name: 'Аффинные координаты и преобразования.', list_id: 3,  last_change:'04.12.2022'},
    {id: 8, name: 'Криволинейные системы координат.', list_id: 3,  last_change:'04.12.2022'},
    {id: 9, name: 'Локальные базисы криволинейных координат.', list_id: 3,  last_change:'04.12.2022'},
    {id: 10, name: 'Коэффициенты Ламе. Проекции скорости точки на оси криволинейной системы координат', list_id: 3,  last_change:'04.12.2022'},
    
]