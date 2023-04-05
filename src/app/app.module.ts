import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./material/material.module";
import {BlogComponent} from "./blog.component";
import {HttpClientModule} from "@angular/common/http";
import {APP_BASE_HREF} from "@angular/common";
import {SafeHtmlPipe} from "./safe.html.pipe";

//https://stackoverflow.com/questions/46419026/missing-locale-data-for-the-locale-xxx-with-angular
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
registerLocaleData(localeNl, 'nl-NL');

@NgModule({
	declarations: [
		AppComponent,
		BlogComponent,
		SafeHtmlPipe,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MaterialModule,
		FormsModule,
		HttpClientModule,
	],
	providers: [
		{provide: APP_BASE_HREF, useValue: '/rpg-blog'},
		{provide: LOCALE_ID, useValue: "nl-NL"},//https://stackoverflow.com/questions/46419026/missing-locale-data-for-the-locale-xxx-with-angular
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
