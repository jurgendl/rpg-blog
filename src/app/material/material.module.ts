// https://itecnote.com/tecnote/angular-material-styles-not-being-applied-correctly/

import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

import {DragDropModule} from '@angular/cdk/drag-drop';
import {A11yModule} from '@angular/cdk/a11y';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {CdkListboxModule} from '@angular/cdk/listbox';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {OverlayModule} from '@angular/cdk/overlay';
import {CdkMenuModule} from '@angular/cdk/menu';
import {DialogModule} from '@angular/cdk/dialog';

import {MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatDividerModule} from '@angular/material/divider';

const COMMON_MATERIAL_MODULES = [
	MatAutocompleteModule,
	MatBadgeModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatChipsModule,
	MatStepperModule,
	MatDatepickerModule,
	MatDialogModule,
	MatExpansionModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatRippleModule,
	MatSelectModule,
	MatSidenavModule,
	MatSliderModule,
	MatSlideToggleModule,
	MatSnackBarModule,
	MatSortModule,
	MatTableModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule,
	MatTreeModule,
	MatNativeDateModule,
	MatBottomSheetModule,
	MatDividerModule
];

@NgModule({
	declarations: [],
	imports: [
		CommonModule, // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! https://blog.zimbaroos.in/post/2021/05/18/error-can-t-bind-to-ngforof-since-it-isn-t-a-known-property-of-ion-item#:~:text=Error%3A%20NG0303%3A%20Can't,of%20'ion%2Ditem'.&text=Explanation%3A%20This%20error%20occurs%20when,used%20by%20that%20HTML%20file.
		FormsModule, // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		ReactiveFormsModule, // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		RouterLink, // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//DragDropModule,// chips drag and drop https://stackblitz.com/angular/rnjaakoakda?file=src%2Fapp%2Fmaterial-module.ts
		DragDropModule, A11yModule, CdkAccordionModule, ClipboardModule, CdkListboxModule, PortalModule, ScrollingModule, CdkStepperModule, CdkTableModule, CdkTreeModule, OverlayModule, CdkMenuModule, DialogModule, // cdk
		...COMMON_MATERIAL_MODULES,
	],
	exports: [
		...COMMON_MATERIAL_MODULES,
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {floatLabel: 'always'}},
		{provide: MAT_DATE_LOCALE, useValue: 'nl-BE'},
	]
})
export class MaterialModule {
	constructor(public matIconRegistry: MatIconRegistry) {
		// matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
	}

	static forRoot(): ModuleWithProviders<MaterialModule> {
		return {
			ngModule: MaterialModule,
			providers: [MatIconRegistry]
		};
	}
}
