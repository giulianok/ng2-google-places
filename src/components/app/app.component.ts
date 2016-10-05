import {Component, AfterViewInit} from "@angular/core";
import {getComponentTemplate} from "../../utilities/get-component-template.function";
import {ILatLong} from "../../utilities/interfaces/latLong.interface";
import ControlPosition = google.maps.ControlPosition;
import {NgModel} from "@angular/forms";
import {NgStyle, NgClass} from "@angular/common";

@Component({
    selector: 'app',
    templateUrl: getComponentTemplate('app'),
    providers: [
        NgModel,
        NgStyle,
        NgClass
    ]
})
export class AppComponent implements AfterViewInit {

    showList:boolean = false;
    errorMessage:string;
    loading:boolean = true;
    loadingMessage:string = 'Finding your location...';
    map:any;
    defaultLatLong:ILatLong;
    servicePlaces:google.maps.places.PlacesService;
    searchText:string;
    results:google.maps.places.PlaceResult[];

    constructor() {
        console.log('dada');
        this.defaultLatLong = {
            lat: 25.8140921,
            long: -80.2143472
        };
    }

    ngAfterViewInit(): void {
        this.getGeolocation()
            .then((data:ILatLong) => {
                const location = new google.maps.LatLng(data.lat, data.long);
                this.createMap(location);
                this.loading = false;
                this.loadingMessage = null;
            });
    }

    getGeolocation():Promise<ILatLong> {
        return new Promise((resolve) => {
            if ("geolocation" in navigator) {

                navigator.geolocation.getCurrentPosition((position) => {
                    resolve({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    });
                }, (err) => {
                    console.error(err);
                    this.errorMessage = `Unable to retrieve your location. Default will be used`;
                    resolve(this.defaultLatLong);
                })

            } else {
                resolve(this.defaultLatLong);
            }
        });
    }

    createMap(location:any):void {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 15,
            mapMaker: true,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControlOptions: {
                position: ControlPosition.RIGHT_CENTER
            }
        });

        this.servicePlaces = new google.maps.places.PlacesService(this.map);

        // Add User position
        this.addMarker(location, 'http://maps.gstatic.com/mapfiles/circle.png');
    }

    onSearch():void {
        this.loading = true;

        this.findPlaces()
            .then((results) => {
                this.loading = false;
                this.results = results;
                console.log(results);
            });
    }

    private addMarker(location:any, icon:string):void {
        const marker = new google.maps.Marker({
            map: this.map,
            position: location,
            icon: {
                url: icon,
                anchor: new google.maps.Point(10, 10),
                scaledSize: new google.maps.Size(10, 17)
            }
        });
    }

    private findPlaces():Promise<any> {
        return new Promise((resolve) => {
            const request:google.maps.places.TextSearchRequest = {
                query: this.searchText
            };

            this.servicePlaces.textSearch(request, (results:google.maps.places.PlaceResult[]) => {
                resolve(results);
            });
        });
    }

    getPriceLevel(level:number):string {
        let price = '';
        for(var i = 0; i <= level; i++) {
            price += '$';
        }
        return price;
    }

}