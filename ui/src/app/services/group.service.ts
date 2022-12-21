import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, getHttpOptions } from './auth.service';
import { switchMap, throwError } from 'rxjs';
import { Group } from '../interfaces/interfaces';
import { HOST } from 'src/config';

@Injectable({providedIn: 'root'})
export class GroupService {
    constructor(private httpClient: HttpClient, private auth: AuthService) { }

    getGroup(){
        return this.auth.currentUser.pipe(switchMap(user => {
            if(!user) return throwError(() => "Unauthorized");
            return this.httpClient.get<Group>(`${HOST}/api/group/${user.group_id}`, getHttpOptions())
        }))
    }
    postGroup(group: Group){
        return this.httpClient.post(`${HOST}/api/group/create`, group, getHttpOptions())
    }
    
}