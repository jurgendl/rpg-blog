import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Post {
	id: number;
	title: string;
	text: string;
	plainText: string;
	date: Date; /* JSON.stringify({'now': new Date()}) */
	extra: string;
	images: string[];
}

@Injectable({
	providedIn: 'root',
})
export class BlogService {
	constructor(private http: HttpClient) {
	}

	//https://dev.to/sanchithasr/3-ways-to-convert-html-text-to-plain-text-52l8
	convertToPlain(html: string) {
		// Create a new div element
		const tempDivElement = document.createElement("div");

		// Set the HTML content with the given value
		tempDivElement.innerHTML = html;

		// Retrieve the text property of the element
		return tempDivElement.textContent || tempDivElement.innerText || "";
	}

	getPlainText(post: Post): string {
		if (!post.plainText) post.plainText = this.convertToPlain(post.text).toLowerCase();
		return post.plainText;
	}

	convertToRegex(term: string): RegExp {
		// Escape special characters in the search term
		let regexTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		// Replace * with .*
		regexTerm = regexTerm.replace(/\*/g, '.*');
		// Create regular expression object with global and case-insensitive flags
		return new RegExp(regexTerm, 'gi');
	}

	getPosts(): Observable<Post[]> {
		return this.http.get<Post[]>('assets/posts.json');
	}
}
