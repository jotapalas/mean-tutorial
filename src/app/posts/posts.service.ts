import { Injectable,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string, posts: any }>(
        'http://localhost:1337/api/posts'
      )
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(posts => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>
    ('http://localhost:1337/api/posts/' + id);
  }

  addPost(post: Post) {
    this.http.post<{postId: string}>('http://localhost:1337/api/posts', post)
      .subscribe((res) => {
        post.id = res.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(postId: string, post: Post) {
    this.http.put('http://localhost:1337/api/posts/' + postId, post)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:1337/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => {
          return post.id !== postId;
        });
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
