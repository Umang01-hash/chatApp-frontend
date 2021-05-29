import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  users : any = [];
  loggedInUser: any;

  constructor( private usersService : UsersService , private tokenService : TokenService) { }

  ngOnInit(): void {
      this.loggedInUser=this.tokenService.GetPayload();
      this.GetUsers();
  }

  GetUsers(){
    this.usersService.GetAllUsers().subscribe(data => {
      _.remove(data.result , { username : this.loggedInUser.username });
      this.users=data.result;
    })
  }

  FollowUser(user: any){
    this.usersService.FollowUser(user._id).subscribe(data => {
      console.log(data);
    });
  }

}