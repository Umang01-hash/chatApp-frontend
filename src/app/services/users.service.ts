import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  GetAllUsers(): Observable<any> {
    return this.http.get(`${BASEURL}/users`);
  }

  FollowUser(userFollowed: any): Observable<any> {
    return this.http.post(`${BASEURL}/follow-user`, {userFollowed});
  }


}