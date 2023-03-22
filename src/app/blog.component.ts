import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BlogService, Post} from './blog.service';

@Component({
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
	searchTerm = '';
	posts$!: Observable<Post[]>;

	constructor(private blogService: BlogService) {
	}

	ngOnInit(): void {
		this.posts$ = this.blogService.getPosts();
	}

	search(): void {
		this.posts$ = this.blogService.searchPosts(this.searchTerm);
	}
}
