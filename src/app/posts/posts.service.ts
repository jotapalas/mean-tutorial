import { Injectable,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?page=${currentPage}&pageSize=${postsPerPage}`;
    this.http
      .get<{ message: string, posts: any, maxPosts: number }>(
        'http://localhost:1337/api/posts' + queryParams
      )
      .pipe(map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }),
          postCount: postData.maxPosts
        };
      }))
      .subscribe(postsData => {
        this.posts = postsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: postsData.postCount
        });
      });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>
    ('http://localhost:1337/api/posts/' + id);
  }

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    this.http.post<{postId: string, post: Post}>(
      'http://localhost:1337/api/posts', postData
    )
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(postId: string, post: Post, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', image, post.title);
    } else {
      post.imagePath = image;
      postData = post;
    }
    this.http.put<{_id: string, title: string, content: string, imagePath: string}>
    (
      'http://localhost:1337/api/posts/' + postId, postData
    )
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:1337/api/posts/' + postId);
  }
}
