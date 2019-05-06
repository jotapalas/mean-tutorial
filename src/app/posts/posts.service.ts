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
            id: post._id,
            imagePath: post.imagePath
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
        post.id = res.postId;
        post.title = res.post.title;
        post.content = res.post.content;
        post.imagePath = res.post.imagePath;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
    this.http.put('http://localhost:1337/api/posts/' + postId, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === postId);
        const newPost: Post = {
          id: postId,
          title: post.title,
          content: post.content,
          imagePath: response.imagePath
        };
        updatedPosts[oldPostIndex] = newPost;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
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
