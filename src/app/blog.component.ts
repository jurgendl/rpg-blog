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
		this.blogService.getPosts().subscribe(posts => {
			posts.forEach(post => {
				this.blogService.getPlainText(post);
			});
			this.posts$ = posts;
			localStorage.setItem('posts', JSON.stringify(posts));
		});
	}

	search(searchTerm: string) {
		const regex = this.blogService.convertToRegex(searchTerm);
		console.log('regex', searchTerm, regex);
		this.blogService.getPosts().subscribe(posts => {
			this.posts$ = searchTerm && searchTerm.length > 0 ? (posts.filter(post => post.title.match(regex) || this.blogService.getPlainText(post).match(regex))) : posts;
		});
	}
}
