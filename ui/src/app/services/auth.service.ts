import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, of, OperatorFunction, tap } from 'rxjs';
import { user } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HOST } from 'src/config';

@Injectable({providedIn: 'root'})
export class AuthService {
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
        this.http.get<{user: user}>(`${HOST}/api/profile`, getHttpOptions())
        .pipe(
            catchError(err => {
                return of(null);
            })
        )
        .subscribe(resp  => {
            this.currentUserSubject.next(resp ? resp.user : null)
        } )
    }

    getProfile(){
        return this.http.get<user>(`${HOST}/api/profile`, getHttpOptions());
    }
    editProfile(user: user){
        return this.http.put<user>(`${HOST}/api/profile/edit`, user, getHttpOptions());
    }
    logout(){
        return this.http.get(`${HOST}/auth/logout`, getHttpOptions()).pipe(
            tap(res => this.currentUserSubject.next(null))
        )
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