import {Component, OnInit} from '@angular/core';
import {BlogService, Post} from './blog.service';

@Component({
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
	posts$!: Post[];

	constructor(private blogService: BlogService) {
	}

	ngOnInit(): void {
		this.blogService.getPosts().subscribe(posts => this.posts$ = posts);
	}

	search(searchTerm: string) {
		console.log('zoek naar: ' + JSON.stringify(searchTerm));
		const searchTermLC = searchTerm.toLowerCase();
		this.blogService.getPosts().subscribe(posts => {
			if (searchTerm && searchTerm.length > 0) {
				posts = posts.filter(post => {
					if(!post.plainText)	post.plainText = this.blogService.convertToPlain(post.text).toLowerCase();
					return post.title.toLowerCase().includes(searchTermLC) || post.plainText.includes(searchTermLC);
				});
			}
			this.posts$ = posts;
		});
	}
}
