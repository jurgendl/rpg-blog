import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';
import $ from "jquery";
import {SimpleKeyboard} from 'simple-keyboard';
//import * as Modernizr from 'modernizr';
//import * as Modernizr from '@types/modernizr';
//import Modernizr from 'modernizr';

export interface Post {
	id: number;
	title: string;
	text: string;
	plainText: string;
	date: Date; /* JSON.stringify({'now': new Date()}) */
	extra: string;
	images: string[];
}

@Component({
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit, AfterViewChecked {
	posts$!: Post[];
	timerId: number | undefined;
	myKeyboard: SimpleKeyboard | undefined;
	touchevents: boolean = false;

	/*search(searchTerm: string) {
		const regex = this.blogService.convertToRegex(searchTerm);
		console.log('regex', searchTerm, regex);
		this.blogService.getPosts().subscribe(posts => {
			this.posts$ = searchTerm && searchTerm.length > 0 ? (posts.filter(post => post.title.match(regex) || this.blogService.getPlainText(post).match(regex))) : posts;
		});
	}*/

	constructor(private http: HttpClient) {
	}

	// https://www.geeksforgeeks.org/how-to-detect-touch-screen-device-using-javascript/
	isTouchEnabled() {
		if(!this.touchevents) {
			try {
				// @ts-ignore
				this.touchevents = (window.Modernizr as any).touchevents;
				// @ts-ignore
				console.log("a:touchevents: ", (window.Modernizr as any).touchevents);
				return this.touchevents;
			} catch (e) {
				if (document.documentElement.classList.contains('no-touchevents')) {
					console.log("b:no-touchevents: ", document.documentElement.classList.contains('no-touchevents'));
					this.touchevents = false;
				} else if (document.documentElement.classList.contains('touchevents')) {
					console.log("c:touchevents: ", document.documentElement.classList.contains('touchevents'));
					this.touchevents = true;
				} else {
					console.log("d:touchevents: ", ( 'ontouchstart' in window ) ||
						( navigator.maxTouchPoints > 0 ) ||
						( (navigator as any).msMaxTouchPoints > 0 ));
					this.touchevents = ( 'ontouchstart' in window ) ||
						( navigator.maxTouchPoints > 0 ) ||
						( (navigator as any).msMaxTouchPoints > 0 );
				}
			}
		}
		return this.touchevents;
	}

	ngOnInit(): void {
		this.getPosts().subscribe(posts => {
			posts.forEach(post => {
				post.plainText = this.convertToPlainText(post.text);
			});
			this.posts$ = posts;
			//localStorage.setItem('posts', JSON.stringify(posts));
		});
		this.init();
	}

	//https://dev.to/sanchithasr/3-ways-to-convert-html-text-to-plain-text-52l8
	convertToPlainTextInner(html: string) {
		// Create a new div element
		const tempDivElement = document.createElement("div");
		// Set the HTML content with the given value
		tempDivElement.innerHTML = html;
		// Retrieve the text property of the element
		return tempDivElement.textContent || tempDivElement.innerText || "";
	}

	convertToPlainText(html: string) {
		// This is a TypeScript code that defines a function that takes an HTML string as input, converts it to plain text, removes redundant white spaces, and returns the resulting plain text as a string.
		//
		// 	Here's what the code does, line by line:
		//
		// const s: string = this.convertToPlainTextInner(html);
		// The input HTML string is passed to the convertToPlainTextInner method to convert it into a plain text string, which is then stored in the constant s. The const keyword is used to define an immutable variable that cannot be reassigned.
		//
		// 	return s.toLowerCase().replace(/\t/g, ' ').replace(/(\r\n|\r|\n)/g, ' ').replace(/ +(?= )/g, '').trim();
		// The s string is converted to lowercase using the toLowerCase() method, and then it undergoes several transformations using the replace() method with regular expressions:
		//
		// 	/\t/g, ' ' replaces all tab characters with a single space.
		// /(r\n|r|\n)/g, ' ' replaces all new line characters with a single space.
		// / +(?= )/g, '' replaces all multiple spaces with a single space.
		// 	Finally, the trim() method removes any leading and trailing white spaces from the resulting plain text string.
		//
		// 	In summary, this code takes an HTML string, converts it to plain text, and returns the resulting string with redundant white spaces removed.
		const toPlainTextInner: string = this.convertToPlainTextInner(html);
		return toPlainTextInner.toLowerCase().replace(/\t/g, ' ').replace(/(\r\n|\r|\n)/g, ' ').replace(/ +(?= )/g, '').trim();
	}

	getPlainTextFor(index: number): string {
		return this.getPlainText(this.getPostFromStorage()[index]);
	}

	getPlainText(post: Post): string {
		return post.plainText;
	}

	convertToRegex(term: string): RegExp {
		// Escape special characters in the search term
		let regexTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		console.log("regexTerm: ", regexTerm);
		// Replace * with .*
		regexTerm = regexTerm.replace(/\*/g, '.*');
		console.log("regexTerm: ", regexTerm);
		// split up into words keeping words between double quotes together, then join with | to create regex
		regexTerm = '(' + regexTerm.match(/("[^"]+"|\w+)/g)!.map(wordOrSentence => wordOrSentence.replace(/"/g, '')).join('|') + ')';
		console.log("regexTerm: ", regexTerm);
		// Create regular expression object with global and case-insensitive flags
		const regex = new RegExp(regexTerm, 'gi');
		console.log("regex: ", regex);
		return regex;
	}

	getPosts(): Observable<Post[]> {
		return this.http.get<Post[]>('assets/posts.json');
	}

	contains(sentence: string, regex: RegExp): boolean {
		return regex.test(sentence);
	}

	processNode(index: number, node: HTMLElement, regex: RegExp) {
		console.log("processNode: ", index, node.innerHTML);
		const childNodes = node.childNodes;
		for (let i = 0; i < childNodes.length; i++) {
			const childNode = childNodes[i] as HTMLElement;
			if (childNode.nodeType === Node.TEXT_NODE) {
				console.log("childNode.textContent: ", childNode.textContent);
				const replaced: string = childNode.textContent?.replace(regex, '<span class="selected">$1</span>') as string;
				if (replaced !== childNode.textContent) {
					console.log("childNode: ", childNode);
					const newNode: HTMLSpanElement = document.createElement('span');
					newNode.innerHTML = replaced;
					childNode.parentNode?.replaceChild(newNode, childNode);
					console.log("replaced: ", replaced);
					console.log("childNode*: ", newNode);
					console.log("childNode.innerHTML: ", newNode.innerHTML);
				}
			} else if (childNode.nodeType === Node.ELEMENT_NODE) {
				const tagName = (childNode as any).tagName.toLowerCase();
				if (tagName !== 'script' && tagName !== 'style') {
					this.processNode(index, childNode, regex);
				}
			} else {
				console.log("processNode: ", index, "unknown node type", childNode.nodeType);
			}
		}
	}

	mark(index: number, node: JQuery<HTMLElement>, regex: RegExp) {
		this.restore(index, node);
		this.processNode(index, node.find('.actual-text')[0], regex);
	}

	getPostFromStorage(): Post[] {
		//const posts = JSON.parse(localStorage.getItem('posts') as string) as Post[];
		const posts = this.posts$;
		return posts;
	}

	restore(index: number, node: JQuery<HTMLElement>) {
		const s = this.getPostFromStorage()[index].text;
		node.find('.actual-text').html(s);
	}

	doSearch(self: any) {
		const searchBoxDom = document.getElementById('search-box') as HTMLInputElement;
		let _visible = 0;
		if (!searchBoxDom.value || searchBoxDom.value.trim().length == 0) {
			$(".card").each(function (index) {
				_visible++;
				const element = $(this) as JQuery<HTMLElement>;
				self.restore(index, element);
				$(this).show("slow");
			});
		} else {
			const regex = self.convertToRegex(searchBoxDom.value);
			$(".card").each(function (index) {
				const element = $(this) as JQuery<HTMLElement>;
				const _v = self.contains(self.getPlainTextFor(index), regex);
				if (_v) {
					_visible++;
					self.mark(index, element, regex);
					element.show("slow");
				} else {
					self.restore(index, element);
					element.hide("slow");
				}
			});
		}
		$("#search-box-results").text(_visible + " results");
	}

	throttleFunction(func: Function, delay: number) {
		const self = this;

		if (this.timerId) {
			return;
		}
		this.timerId = setTimeout(function () {
			func();
			self.timerId = undefined;
		}, delay);
	}

	init() {
		const self = this;

		const searchBoxDom = document.getElementById('search-box') as HTMLInputElement;
		searchBoxDom.addEventListener('input', () => self.throttleFunction(() => self.doSearch(self), 1000));
		searchBoxDom.addEventListener('paste', () => self.throttleFunction(() => self.doSearch(self), 0));

		// https://hodgef.com/simple-keyboard/demos/
		// https://www.npmjs.com/package/simple-keyboard
		//const Keyboard = (window as any).SimpleKeyboard.default as SimpleKeyboard;
		if(!this.isTouchEnabled()) {
			console.log("SimpleKeyboard");
			self.myKeyboard = new SimpleKeyboard({
				onChange: function (input: string) {
					(document.querySelector(".search-box") as HTMLInputElement).value = input;
					self.throttleFunction(() => self.doSearch(self), 1000);
				},
				onKeyPress: function (button: any) {
					//
				}
			});
			$('#search-box').on('focus', function () {
				$('#keyboard').show("slow");
				$("#keyboard-hide").show("slow");
			});
			$("#keyboard-hide").on('click', function () {
				$('#keyboard').hide("slow");
				$("#keyboard-hide").hide("slow");
			});
		}

		$("#search-box-clear").on('click', function () {
			$('#search-box').val("");
			if(self.myKeyboard) self.myKeyboard.clearInput();
			self.throttleFunction(() => self.doSearch(self), 0);
		});
	}

	// https://stackoverflow.com/questions/52715190/running-a-function-after-the-dom-of-an-angular-component-has-changed-similar-to
	ngAfterViewChecked(): void {
		const self = this;

		$(".actual-text person").on('click', function () {
			console.log("actual-text: ", $(this).text());
			$('#search-box').val($(this).text());
			if(self.myKeyboard) self.myKeyboard.setInput($(this).text());
			self.throttleFunction(() => self.doSearch(self), 0);
		});
		$(".actual-text location").on('click', function () {
			console.log("actual-text: ", $(this).text());
			$('#search-box').val($(this).text());
			if(self.myKeyboard) self.myKeyboard.setInput($(this).text());
			self.throttleFunction(() => self.doSearch(self), 0);
		});
		$(".actual-text item").on('click', function () {
			console.log("actual-text: ", $(this).text());
			$('#search-box').val($(this).text());
			if(self.myKeyboard) self.myKeyboard.setInput($(this).text());
			self.throttleFunction(() => self.doSearch(self), 0);
		});
	}
}
