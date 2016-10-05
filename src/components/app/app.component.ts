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
    map:google.maps.Map;
    defaultLatLong:ILatLong;
    servicePlaces:google.maps.places.PlacesService;
    searchText:string;
    results:google.maps.places.PlaceResult[];
    infoWindow:google.maps.InfoWindow;
    markers:google.maps.Marker[] = [];

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
                const location:google.maps.LatLng = new google.maps.LatLng(data.lat, data.long);
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

    createMap(location:google.maps.LatLng):void {
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
        this.infoWindow = new google.maps.InfoWindow();

        // Add User position
        const marker = this.addMarker(location, 'http://maps.gstatic.com/mapfiles/circle.png', false);
        this.addMarkerEvent(marker, `You're here!`);
    }

    onSearch():void {
        if (!this.searchText) {

            this.errorMessage = 'Please enter a word, ex: Pizza';

        } else {

            this.loading = true;

            this.findPlaces()
                .then((results: google.maps.places.PlaceResult[]) => {
                    this.loading = false;
                    this.results = results;
                    this.showList = false;

                    this.clearMarkers();

                    results.forEach((result: google.maps.places.PlaceResult) => {
                        const location: google.maps.LatLng = new google.maps.LatLng(result.geometry.location.lat(), result.geometry.location.lng());
                        const marker = this.addMarker(location, result.icon);
                        const template = `
                            <h1 style="font-size: 20px">${result.name}</h1>
                            <a href="https://www.google.com/maps/place/${result.formatted_address}" target="_blank">${result.formatted_address}</a>
                        `;
                        this.addMarkerEvent(marker, template);
                    });
                });
        }
    }

    private addMarker(location:google.maps.LatLng, icon:string, save:boolean = true):google.maps.Marker {
        const marker = new google.maps.Marker({
            map: this.map,
            position: location,
            icon: {
                url: icon,
                anchor: new google.maps.Point(10, 10),
                scaledSize: new google.maps.Size(19, 32)
            }
        });

        // Saving the marking to be able to change or delete it
        if (save)
            this.markers.push(marker);

        return marker;
    }

    private addMarkerEvent(marker:google.maps.Marker, content:string):void {
        // return new Promise((resolve) => {
            google.maps.event.addListener(marker, 'click', () => {
                this.infoWindow.setContent(content);
                this.infoWindow.open(this.map, marker);
            });
        // });
    }

    private findPlaces():Promise<any> {
        return new Promise((resolve) => {
            const request:google.maps.places.TextSearchRequest = {
                query: this.searchText,
                location: this.map.getCenter(),
                radius: .001
            };

            this.servicePlaces.textSearch(request, (results:google.maps.places.PlaceResult[]) => {
                console.log('Found', results.length);
                console.log(results);
                resolve(results);
            });
        });
    }

    private clearMarkers():void {
        this.markers.forEach((marker) => {
            marker.setMap(null);
        });
        this.markers = [];
    }

    getPriceLevel(level:number):string {
        let price = '';
        for(var i = 0; i <= level; i++) {
            price += '$';
        }
        return price;
    }

}