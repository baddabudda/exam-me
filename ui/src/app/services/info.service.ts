import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Faculty, Program } from '../interfaces/interfaces';
import { HOST } from 'src/config';
import { getHttpOptions } from './auth.service';

@Injectable({providedIn: 'root'})
export class InfoService {
    constructor(private httpClient: HttpClient) { }

    getFaculties(){
        return this.httpClient.get<Faculty[]>(`${HOST}/api/university/faculty/all`, getHttpOptions())
    }
    getPrograms(){
        return this.httpClient.get<Program[]>(`${HOST}/api/university/program/all`, getHttpOptions())
    }
    
}