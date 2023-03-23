import {DomSanitizer} from "@angular/platform-browser";
import {Pipe, PipeTransform} from "@angular/core";

// https://blog.briebug.com/blog/how-do-i-display-html-inside-an-angular-binding
@Pipe({ name: "safeHtml" })
export class SafeHtmlPipe implements PipeTransform {
	constructor(private sanitizer: DomSanitizer) {}

	transform(value: string) {
		return this.sanitizer.bypassSecurityTrustHtml(value);
	}
}
