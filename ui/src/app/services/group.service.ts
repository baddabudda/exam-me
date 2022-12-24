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
    editGroup(groupid: number,group: any){
        return this.httpClient.put(`${HOST}/api/group/${groupid}/edit`, group, getHttpOptions())
    }

    getInvite(groupId: number){
        return this.httpClient.get(`${HOST}/api/group/${groupId}/invite`, getHttpOptions());
    }

    joinGroup(token: string){
        return this.httpClient.post(`${HOST}/api/group/join/${encodeURIComponent(token)}`, {},getHttpOptions());
    }

    giveAdmin(group_id: number, user_id: number){
        return this.httpClient.put(`${HOST}/api/group/${group_id}/change-admin`, {group_id, user_id}, getHttpOptions())
    }

    expelUser(group_id: number, delete_user_id: number){
        return this.httpClient.put(`${HOST}/api/group/${group_id}/expel`, {group_id, delete_user_id}, getHttpOptions())
    }
    
}
