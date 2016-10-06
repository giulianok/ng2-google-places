import {Component, AfterViewInit} from "@angular/core";
import {getComponentTemplate} from "../../utilities/get-component-template.function";
import {ILatLong} from "../../utilities/interfaces/latLong.interface";
import ControlPosition = google.maps.ControlPosition;
import {NgModel} from "@angular/forms";
import {NgStyle, NgClass} from "@angular/common";
import {IPlaceResult} from "../../utilities/interfaces/placeResult.interface";

@Component({
    selector: 'google-places',
    templateUrl: getComponentTemplate('google-places'),
    providers: [
        NgModel,
        NgStyle,
        NgClass
    ]
})
export class GooglePlacesComponent implements AfterViewInit {

    showList:boolean = false;
    errorMessage:string;
    loading:boolean = true;
    loadingMessage:string = 'Finding your location...';
    map:google.maps.Map;
    defaultLatLong:ILatLong;
    servicePlaces:google.maps.places.PlacesService;
    searchText:string;
    results:IPlaceResult[];
    infoWindow:google.maps.InfoWindow;
    markers:google.maps.Marker[] = [];
    selectedPlace:number;

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
        const marker = this.addMarker(location, 'http://maps.gstatic.com/mapfiles/circle.png', false, 19, 32);
        this.addMarkerEvent(marker, `You're here!`);

        google.maps.event.addListener(this.infoWindow,'closeclick', () => {
            this.selectedPlace = null;
        });
    }

    onSearch():void {
        if (!this.searchText) {
            this.errorMessage = 'Please enter a word, ex: Pizza';
        } else {
            this.errorMessage = null;
            this.loading = true;
            this.findPlaces()
                .then((results: IPlaceResult[]) => {
                    this.loading = false;
                    this.results = results;
                    this.showList = false;

                    this.clearMarkers();

                    results.forEach((result: IPlaceResult) => {
                        const location: google.maps.LatLng = new google.maps.LatLng(result.geometry.location.lat(), result.geometry.location.lng());
                        const marker = this.addMarker(location, result.icon);

                        let openTemplate = '';

                        const template = `
                            <div class="google-places-infoWindow">
                                <h1 class="google-places-infoWindow__title">${result.name}</h1>
                                ${result.formatted_address}
                                <br>
                                <a href="https://www.google.com/maps/place/${result.formatted_address}" target="_blank">View on Google Maps</a>
                            </div>
                        `;
                        this.addMarkerEvent(marker, template);
                    });
                });
        }
    }

    private addMarker(location:google.maps.LatLng, icon:string, save:boolean = true, width:number = 25, height:number = 25):google.maps.Marker {
        const marker = new google.maps.Marker({
            map: this.map,
            position: location,
            icon: {
                url: icon,
                anchor: new google.maps.Point(10, 10),
                scaledSize: new google.maps.Size(width, height)
            }
        });

        // Saving the marking to be able to change or delete it
        if (save)
            this.markers.push(marker);

        return marker;
    }

    private addMarkerEvent(marker:google.maps.Marker, content:string):void {
        google.maps.event.addListener(marker, 'click', () => {
            this.infoWindow.setContent(content);
            this.infoWindow.open(this.map, marker);
            this.map.setCenter( marker.getPosition() );

            const markerIndex = this.markers.findIndex((obj) => {
                return obj == marker;
            });

            if (markerIndex >= 0) {
                this.selectedPlace = markerIndex;
            }

        });
    }

    private findPlaces():Promise<any> {
        return new Promise((resolve) => {
            const request:google.maps.places.TextSearchRequest = {
                query: this.searchText,
                location: this.map.getCenter(),
                radius: .001
            };

            this.servicePlaces.textSearch(request, (results:IPlaceResult[]) => {
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

    selectPlace(index:number) {
        if (index && this.results[index] != undefined) {
            this.selectedPlace = index;
            google.maps.event.trigger(this.markers[index], 'click');
            this.showList = false;
        }
    }

    getPriceLevel(level:number):string {
        let price = '';
        for(var i = 0; i <= level; i++) {
            price += '$';
        }
        return price;
    }

}