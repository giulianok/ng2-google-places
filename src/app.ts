import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppComponent} from "./components/app/app.component";
import {NgModel, FormsModule} from "@angular/forms";

@NgModule({
    imports      : [
        BrowserModule,
        FormsModule
    ],
    declarations : [AppComponent],
    bootstrap    : [AppComponent]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
