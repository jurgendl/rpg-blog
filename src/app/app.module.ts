import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./material/material.module";
import {BlogComponent} from "./blog.component";
import {HttpClientModule} from "@angular/common/http";
import {APP_BASE_HREF} from "@angular/common";

@NgModule({
	declarations: [
		AppComponent,
		BlogComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MaterialModule,
		FormsModule,
		HttpClientModule,
	],
	providers: [{provide: APP_BASE_HREF, useValue: '/rpg-blog'}],
	bootstrap: [AppComponent]
})
export class AppModule {
}
