import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client';
import * as moment from 'moment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  socket: any;

  commentForm!: FormGroup;
  postId: any;
  commentArray: any = [];
  post!: string;
  
  constructor(private fb: FormBuilder, private postService: PostService, private route: ActivatedRoute) {
    this.socket = io('http://localhost:3000');
   }

  ngOnInit(): void {
    this.toolbarElement = document.querySelector('.nav-content');
    this.postId = this.route.snapshot.paramMap.get('id');

    this.init();
    
    this.GetPost();
    this.socket.on('refreshPage', () =>{
      this.GetPost();
    });
  }

  init() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    })
  }

  ngAfterViewInit(): void {
    this.toolbarElement.style.display = 'none';
  }

  AddComment(){
    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe(data => {
      this.socket.emit('refresh', {});
      this.commentForm.reset();
    })
  }

  GetPost() {
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data.post.post;
      this.commentArray = data.post.comments.reverse();
    });
  }

  TimeFromNow(time: any) {
    return moment(time).fromNow();
  }

}
