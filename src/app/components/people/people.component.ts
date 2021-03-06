import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  socket : any;
  users : any = [];
  loggedInUser: any;
  userArr: any =[];
  onlineusers=[];

  constructor( private usersService : UsersService , private tokenService : TokenService) {
    this.socket=io('http://localhost:3000');
   }

  ngOnInit(): void {
      this.loggedInUser=this.tokenService.GetPayload();
      this.GetUsers();
      this.GetUser();

      this.socket.on('refreshPage',() => {
        this.GetUsers();
      this.GetUser();
      })
  }

  GetUsers(){
    this.usersService.GetAllUsers().subscribe(data => {
      _.remove(data.result , { username : this.loggedInUser.username });
      this.users=data.result;
    })
  }

  GetUser(){
    this.usersService.GetUserById(this.loggedInUser._id).subscribe(data => {
      this.userArr=data.result.following;

    })
  }

  FollowUser(user: any){
    this.usersService.FollowUser(user._id).subscribe(data => {
      this.socket.emit('refresh', {} );
    });
  }

  CheckInArray(arr: any, id: any){
    const result = _.find(arr, ['userFollowed._id' , id]);
    if(result){
      return true;
    }else{
      return false;
    }
  }

  online(event: any){
    this.onlineusers=event;
  }

  CheckIfOnline(name : any){
    const result=_.indexOf(this.onlineusers , name);
    if(result>-1){
      return true;
    }else{
      return false;
    }
  }

}
