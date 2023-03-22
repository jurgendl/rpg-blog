import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Post {
	id: number;
	title: string;
	text: string;
}

@Injectable({
	providedIn: 'root',
})
export class BlogService {
	private baseUrl = 'https://jurgendl.github.io/rpg-blog/assets/posts.json';

	constructor(private http: HttpClient) {
	}

	getPosts(): Observable<Post[]> {
		return this.http.get<Post[]>(this.baseUrl);
	}

	searchPosts(searchTerm: string): Observable<Post[]> {
		return this.http.get<Post[]>(this.baseUrl).pipe(
			map((posts) =>
				posts.filter(
					(post) =>
						post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
						post.text.toLowerCase().includes(searchTerm.toLowerCase())
				)
			)
		);
	}
}
