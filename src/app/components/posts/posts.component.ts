import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import * as _ from 'lodash';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { TokenService } from 'src/app/services/token.service';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  user: any;
  socket: any;
  posts!: any[];

  constructor( private postService: PostService,
    private tokenService: TokenService,
    private router: Router,
    private fb: FormBuilder) {
    this.socket=io('http://localhost:3000');
   }

  ngOnInit(): void {
    this.AllPosts();
    this.user = this.tokenService.GetPayload();
    this.socket.on('refreshPage',(data: any) => {
      this.AllPosts();
    })
  }

  AllPosts(){
    this.postService.getAllPosts().subscribe(data => {
      this.posts=data.posts;
    }, 
    err => {
      if (err.error.token == null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  TimeFromNow(time: moment.MomentInput){
    return moment(time).fromNow();
  }

  LikePost(post: any) {
    this.postService.addLike(post).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }

  CheckInLikesArray(arr: any, username: any) {
    return _.some(arr, { username: username });
  }

  OpenCommentBox(post: { _id: any; }) {
    this.router.navigate(['post', post._id]);
  }

}
