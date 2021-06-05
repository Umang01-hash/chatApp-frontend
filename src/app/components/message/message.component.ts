import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import * as _ from 'lodash';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit , AfterViewInit ,OnChanges {
  @Input() users: any;
  receiver!: string;
  user: any;
  message!: string;
  receiverData: any;
  messagesArray: any = [];
  socket: any;
  typingMessage: any;
  typing = false;
  isOnline = false;


  constructor(
    private tokenService: TokenService,
    private msgService: MessageService,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.route.params.subscribe((params) => {
      this.receiver = params.name;
      this.GetUserByUserName(this.receiver);

      this.socket.on('refreshPage', () => {
        this.GetUserByUserName(this.receiver);
      });
    });



    this.socket.on('is_typing', (data: any) => {
      if (data.sender === this.receiver) {
        this.typing = true;
      }
    });

    this.socket.on('has_stopped_typing', (data: any) => {
      if (data.sender === this.receiver) {
        this.typing = false;
      }
    })
  }

  ngOnChanges(changes : SimpleChanges){
    const title = document.querySelector('.nameCol');
    if (changes.users.currentValue.length > 0) {
      const result = _.indexOf(changes.users.currentValue, this.receiver);
      if (result > -1) {
        this.isOnline = true;
        (title as HTMLElement).style.marginTop = '10px';
      } else {
        this.isOnline = false;
        (title as HTMLElement).style.marginTop = '20px';
      }
    }
  }

  ngAfterViewInit() {
    const params = {
      room1: this.user.username,
      room2: this.receiver,
    };

    this.socket.emit('join chat', params);
  }

  GetUserByUserName(name: any) {
    this.usersService.GetUserByName(name).subscribe((data) => {
      this.receiverData = data.result;

      this.GetMessages(this.user._id, data.result._id);
    });
  }

  GetMessages(senderId: any, recieverId: any) {
    this.msgService.GetAllMessages(senderId, recieverId).subscribe((data) => {
      this.messagesArray = data.messages.message;
    });
  }

  SendMessage() {
    if (this.message) {
      this.msgService
        .SendMessage(
          this.user._id,
          this.receiverData._id,
          this.receiverData.username,
          this.message
        )
        .subscribe((data) => {
          this.socket.emit('refresh', {});
          this.message = '';
        });
    }
  }

  isTyping() {
    this.socket.emit('start_typing', {
      sender: this.user.username,
      receiver: this.receiver,
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.user.username,
        receiver: this.receiver,
      });
    }, 500);
  }
}