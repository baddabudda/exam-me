import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { user } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HOST } from 'src/config';
import { CookieService } from 'ngx-cookie';

@Injectable({providedIn: 'root'})
export class AuthService {

    session?: {
        key: string,
        sig: string
    };

    currentUserSubject = new BehaviorSubject<undefined|null|user> (undefined);
    public currentUser = this.currentUserSubject.asObservable().pipe(filter(u=> u!==undefined));

    constructor(
        private http: HttpClient,
    ) {
        this.updateUser()
    }
    getUser(){
        return this.currentUserSubject.value;
    }
    setUser(us : user| null){
        this.currentUserSubject.next(us);
    }

    updateUser(){
        this.http.get(`${HOST}/api/profile`, getHttpOptions()).subscribe((resp: any) => {
            this.currentUserSubject.next(resp.user)
        }, err => this.currentUserSubject.next(null) )
    }

    getProfile(){
        return this.http.get<user>(`${HOST}/api/profile`, getHttpOptions());
    }
    editProfile(user: user){
        return this.http.put<user>(`${HOST}/api/profile/edit`, user, getHttpOptions());
    }
}

export function getHttpOptions(){
    let httpOptions = { headers: new HttpHeaders({
        'Content-Type': 'application/json',
        }) ,
        withCredentials: true
    }
    return httpOptions;
}