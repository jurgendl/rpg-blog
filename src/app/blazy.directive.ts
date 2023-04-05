import {Directive, ElementRef, Input} from "@angular/core";
// @ts-ignore
import * as Blazy from "blazy";

// https://gist.github.com/davidmarquis/a702508f86679aa5a7b899a3499fbd15
/**
 * Directive to setup lazy image loading using bLazy.
 * Apply the directive on a container element that is a parent of `img` elements configured for bLazy.
 * The container element must have an ID and be scrollable (overflow: scroll).
 *
 * Sample usage:
 *
 * <div id="blazyContainer" [bLazyLoadImages]="someVariableThatChanges" [bLazyOffset]="300" style="overflow: scroll;">
 *     <div *ngFor="let image of images">
 *         <img class="b-lazy" src="placeholder.jpg" [attr.data-src]="image" />
 *     </div>
 * </div>
 *
 */
@Directive({
	selector: '[bLazyLoadImages]',
})
export class BlazyDirective {
	@Input() bLazyOffset: number = 200;
	bLazyInstance: any = null;

	constructor(private elementRef: ElementRef) {
	}

	@Input() set bLazyLoadImages(value: any) {
		// deferred execution allows bLazy to properly initialize and bind itself.
		setTimeout(() => {
			this.destroyBlazy();
			this.setupBlazy();
		}, 100);
	}

	ngOnDestroy() {
		this.destroyBlazy();
	}

	private setupBlazy() {
		if (this.bLazyInstance) {
			return;
		}

		let elementId = this.elementRef.nativeElement.id;
		if (!elementId) {
			throw Error("The element onto which the [bLazyLoadImages] directive is applied must have an id.");
		}

		this.bLazyInstance = new Blazy({
			container: '#' + elementId,
			root: this.elementRef.nativeElement,
			offset: this.bLazyOffset,
		});
	}

	private destroyBlazy() {
		if (this.bLazyInstance) {
			this.bLazyInstance.destroy();
			this.bLazyInstance = null;
		}
	}
}
