import { AfterViewInit, Component, OnInit, Output , EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import * as _ from 'lodash';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit , AfterViewInit {
  @Output() onlineUsers = new EventEmitter();
  user: any;
  notifications: any = [];
  socket: any;
  count: any = [];
  chatList: any = [];
  msgNumber = 0;


  constructor(
    private tokenService: TokenService,
    private router: Router,
    private usersService: UsersService,
    private msgService : MessageService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();

    const dropDownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false,
    });

    const dropDownElementTwo = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropDownElementTwo, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    this.socket.emit('online' , { room : 'global' , user : this.user.username });

    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  ngAfterViewInit() {
    this.socket.on('usersOnline', (data: any) => {
      this.onlineUsers.emit(data);
    });
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(
      (data) => {
        this.notifications = data.result.notifications.reverse();
        const value = _.filter(this.notifications, ['read', false]);
        this.count = value;
        this.chatList = data.result.chatList;
        this.CheckIfread(this.chatList);

      },
      (err) => {
        if (err.error.token === null) {
          this.tokenService.DeleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }
  CheckIfread(arr: string | any[]) {
    const checkArr = [];
    for (let i = 0; i < arr.length; i++) {
      const receiver = arr[i].msgId.message[arr[i].msgId.message.length - 1];
      if (this.router.url !== `/chat/${receiver.sendername}`) {
        if (receiver.isRead === false && receiver.receivername === this.user.username) {
          checkArr.push(1);
          this.msgNumber = _.sum(checkArr);
        }
      }
    }
  }

  GoToChatPage(name:any){
    this.router.navigate(['chat',name]);
    this.msgService.MarkMessages(this.user.username , name).subscribe(data => {

      this.socket.emit('refresh', {});
    });
  }

  markAll() {
    this.usersService.MarAllAsRead().subscribe((data) => {
      this.socket.emit('refresh', {});
    });
  }

  MarkAllMessages(){
    this.msgService.MarkAllMessages().subscribe(data => {
      this.socket.emit('refresh', {});
      this.msgNumber=0;
    });
  }

  logout() {
    this.tokenService.DeleteToken();
    this.router.navigate(['']);
  }

  GoToHome() {
    this.router.navigate(['streams']);
  }

  TimeFromNow(time: any) {
    return moment(time).fromNow();
  }

  MessageDate(data: moment.MomentInput){
    return moment(data).calendar(null , {
      sameDay : '[Today]',
      lastDay: '[Yesterday]',
      lastWeek : 'DD/MM/YYYY',
      sameElse : 'DD/MM/YYYY',
    })
  }
}
