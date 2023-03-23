import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {debounceTime, Subject} from "rxjs";
import {distinctUntilChanged, filter} from "rxjs/operators";

@Component({
	selector: 'search-component',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
	searchSubject = new Subject<string>();
	searchString: string = '';

	@Output() searchEmitter = new EventEmitter<string>();

	@Input() toonReset = true;

	ngOnInit() {
		this.searchSubject.pipe(//
			debounceTime(400), //
			distinctUntilChanged(), //
			filter(value => value.length >= 2 || value.length == 0))//
			.subscribe((q: string) => {
				console.log("EMIT: " + JSON.stringify(q));
				this.searchEmitter.emit(q);
			});
	}

	search(q: string) {
		console.log("SEARCH: " + JSON.stringify(q));
		this.searchSubject.next(q);
	}

	ngOnDestroy(): void {
		this.searchSubject.complete();
	}

	reset() {
		console.log("RESET");
		this.searchSubject.next('');
		this.searchString = '';
	}
}
