import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit , AfterViewInit {

  tabElement : any;
  online_users=[];

  constructor() {

  }

  ngAfterViewInit(){
    this.tabElement.style.display= 'none';
  }

  ngOnInit(): void {
    this.tabElement = document.querySelector('.nav-content');
  }

  online(event: any){
    this.online_users=event;
  }

}
