import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  socket: any;
  posts: any=[];

  constructor(private postService:PostService) {
    this.socket=io('http://localhost:3000');
   }

  ngOnInit(): void {
    this.AllPosts();

    this.socket.on('refreshPage',(data: any) => {
      this.posts=data.posts;
    })
  }

  AllPosts(){
    this.postService.getAllPosts().subscribe(data => {
      this.posts=data.posts;
    })
  }

  TimeFromNow(time: moment.MomentInput){
    return moment(time).fromNow();
  }

}
