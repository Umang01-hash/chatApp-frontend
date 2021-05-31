import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service'
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  receiver !: string;
  user : any;
  message!:string;
  receiverData : any;

  constructor(private tokenService : TokenService , private msgService : MessageService ,
    private route : ActivatedRoute, private usersService : UsersService) {

     }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.route.params.subscribe(params => {
      this.receiver = params.name;
      this.GetUserByUserName(this.receiver);

    })
  }

  GetUserByUserName(name: any){
      this.usersService.GetUserByName(name).subscribe(data => {
        this.receiverData=data.result;
      })
  }

  SendMessage(){
    this.msgService.SendMessage(this.user._id, this.receiverData._id, this.receiverData.username, this.message) .subscribe(data => {
          console.log(data);
        });
  }



}
