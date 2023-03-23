import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Post {
	id: number;
	title: string;
	text: string;
	plainText: string;
}

@Injectable({
	providedIn: 'root',
})
export class BlogService {
	private baseUrl = 'https://jurgendl.github.io/rpg-blog/assets/posts.json';

	constructor(private http: HttpClient) {
	}

	//https://dev.to/sanchithasr/3-ways-to-convert-html-text-to-plain-text-52l8
	convertToPlain(html: string){
		// Create a new div element
		const tempDivElement = document.createElement("div");

		// Set the HTML content with the given value
		tempDivElement.innerHTML = html;

		// Retrieve the text property of the element
		return tempDivElement.textContent || tempDivElement.innerText || "";
	}

	getPosts(): Observable<Post[]> {
		return this.http.get<Post[]>(this.baseUrl);
	}

	searchPosts(searchTerm: string): Observable<Post[]> {
		const searchTermLC = searchTerm.toLowerCase();
		return this.http.get<Post[]>(this.baseUrl).pipe(
			map((posts) =>
				posts.filter(
					(post) => {
						if(!post.plainText)	post.plainText = this.convertToPlain(post.text).toLowerCase();
						return post.title.toLowerCase().includes(searchTermLC) || post.plainText.includes(searchTermLC);
					}
				)
			)
		);
	}
}
