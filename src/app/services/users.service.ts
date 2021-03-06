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

  GetUserById(id: any): Observable<any> {
    return this.http.get(`${BASEURL}/users/${id}`);
  }

    GetUserByName(username : any): Observable<any> {
    return this.http.get(`${BASEURL}/usersname/${username}`);
  }

  FollowUser(userFollowed: any): Observable<any> {
    return this.http.post(`${BASEURL}/follow-user`, {userFollowed});
  }

  UnFollowUser(userFollowed: any): Observable<any> {
    return this.http.post(`${BASEURL}/unfollow-user`, {userFollowed});
  }

  MarkNotification(id: any, deleteValue?: any): Observable<any> {
    return this.http.post(`${BASEURL}/mark/${id}`, {
      id,
      deleteValue
    });
  }

  MarAllAsRead(): Observable<any> {
    return this.http.post(`${BASEURL}/mark-all`, {
      all: true
    });
  }

  AddImage(image: any) : Observable<any>{
    return this.http.post(`${BASEURL}/upload-image`, {

      image
    });
  }
}