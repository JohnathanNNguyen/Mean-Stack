import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators"
import { Post } from "./post.model";


@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient) { }
  //below when we retrieve the data we want it to be defined the same as out model so below we assign it to our database
  getPosts() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        })
      }))
      .subscribe(updatedPosts => {
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])
      })
  }

  getUpdatePosts() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return { ...this.posts.find(p => p.id === id) }
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content }
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const postId = responseData.postId
        post.id = postId
        this.posts.push(post)
        this.postsUpdated.next([...this.posts])
      })
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId)
        this.posts = updatedPosts
        this.postsUpdated.next([...this.posts])
      })
  }
}
