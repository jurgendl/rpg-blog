import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import $ from "jquery";

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
		if (!post.plainText) {
			post.plainText = this.convertToPlain(post.text).toLowerCase().replace(/\t/g, ' ').replace(/(\r\n|\r|\n)/g, ' ').replace(/ +(?= )/g, '').trim();
		}
		return post.plainText;
	}

	getPlainTextFor(index: number): string {
		return this.getPlainText(this.getPostFromStorage()[index]);
	}

	convertToRegex(term: string): RegExp {
		// Escape special characters in the search term
		let regexTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		// Replace * with .*
		regexTerm = regexTerm.replace(/\*/g, '.*');
		//
		regexTerm = '(' + regexTerm.split(" ").join('|') + ')';
		// Create regular expression object with global and case-insensitive flags
		return new RegExp(regexTerm, 'gi');
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
		this.processNode(index, (node as any).find('.actual-text')[0], regex);
	}

	getPostFromStorage(): Post[] {
		const posts = JSON.parse(localStorage.getItem('posts') as string) as Post[];
		return posts;
	}

	restore(index: number, node: JQuery<HTMLElement>) {
		const s = this.getPostFromStorage()[index].text;
		(node as any).find('.actual-text')[0].html(s);
	}

	doSearch() {
		const searchBoxDom = document.getElementById('search-box') as HTMLInputElement;
		const _this = this;
		let _visible = 0;
		if (!searchBoxDom.value || searchBoxDom.value.trim().length == 0) {
			$(".card").each(function (index) {
				_visible++;
				const element = $(this) as JQuery<HTMLElement>;
				_this.restore(index, element);
				$(this).show("slow");
			});
		} else {
			const regex = this.convertToRegex(searchBoxDom.value);
			$(".card").each(function (index) {
				const element = $(this) as JQuery<HTMLElement>;
				const _v = _this.contains(_this.getPlainTextFor(index), regex);
				if (_v) {
					_visible++;
					_this.mark(index, element, regex);
					element.show("slow");
				} else {
					_this.restore(index, element);
					element.hide("slow");
				}
			});
		}
		$("#search-box-results").text(_visible + " results");
	}

	timerId: any;

	throttleFunction(func: Function, delay: number) {
		const _this = this;
		if (this.timerId) {
			return;
		}
		this.timerId = setTimeout(function () {
			func();
			_this.timerId = undefined;
		}, delay);
	}

	init() {
		const searchBoxDom = document.getElementById('search-box') as HTMLInputElement;
		const _this = this;

		searchBoxDom.addEventListener('input', () => _this.throttleFunction(_this.doSearch, 1000));
		searchBoxDom.addEventListener('paste', () => _this.throttleFunction(_this.doSearch, 0));

		const Keyboard = (window as any).SimpleKeyboard.default;
		const myKeyboard = new Keyboard({
			onChange: function (input: string) {
				(document.querySelector(".search-box") as HTMLInputElement).value = input;
				_this.throttleFunction(_this.doSearch, 1000);
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

		$("#search-box-clear").on('click', function () {
			$('#search-box').val("");
			(myKeyboard as any).clearInput();
			_this.throttleFunction(_this.doSearch, 0);
		});
	}
}
