import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppComponent} from "./components/app/app.component";
import {NgModel, FormsModule} from "@angular/forms";
import {GooglePlacesComponent} from "./components/google-places/google-places.component";
import {HttpModule} from "@angular/http";

@NgModule({
    imports      : [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    declarations : [
        AppComponent,
        GooglePlacesComponent
    ],
    bootstrap    : [AppComponent]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
