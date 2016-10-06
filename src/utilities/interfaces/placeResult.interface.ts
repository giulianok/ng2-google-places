export interface IPlaceResult extends google.maps.places.PlaceResult {
    opening_hours?:{
        open_now?:boolean
    }
}