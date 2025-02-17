/**
 * Created by nico on 07/12/16.
 */
const darkMapJson = [{
    "elementType": "geometry",
    "stylers": [{
        "color": "#212121"
    }]
}, {
    "elementType": "labels.icon",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#757575"
    }]
}, {
    "elementType": "labels.text.stroke",
    "stylers": [{
        "color": "#212121"
    }]
}, {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{
        "color": "#757575"
    }, {
        "visibility": "off"
    }]
}, {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#9e9e9e"
    }]
}, {
    "featureType": "administrative.land_parcel",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#bdbdbd"
    }]
}, {
    "featureType": "poi",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#757575"
    }]
}, {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{
        "color": "#181818"
    }]
}, {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#616161"
    }]
}, {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [{
        "color": "#1b1b1b"
    }]
}, {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#2c2c2c"
    }]
}, {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#8a8a8a"
    }]
}, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{
        "color": "#373737"
    }]
}, {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{
        "color": "#3c3c3c"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [{
        "color": "#4e4e4e"
    }]
}, {
    "featureType": "road.local",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#616161"
    }]
}, {
    "featureType": "transit",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#757575"
    }]
}, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{
        "color": "#000000"
    }]
}, {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#3d3d3d"
    }]
}];
const nightMapJson = [{
    "elementType": "geometry",
    "stylers": [{
        "color": "#242f3e"
    }]
}, {
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#746855"
    }]
}, {
    "elementType": "labels.text.stroke",
    "stylers": [{
        "color": "#242f3e"
    }]
}, {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#d59563"
    }]
}, {
    "featureType": "poi",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#d59563"
    }]
}, {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{
        "color": "#263c3f"
    }]
}, {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#6b9a76"
    }]
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{
        "color": "#38414e"
    }]
}, {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{
        "color": "#212a37"
    }]
}, {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#9ca5b3"
    }]
}, {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{
        "color": "#746855"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{
        "color": "#1f2835"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#f3d19c"
    }]
}, {
    "featureType": "road.local",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "transit",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{
        "color": "#2f3948"
    }]
}, {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#d59563"
    }]
}, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{
        "color": "#17263c"
    }]
}, {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#515c6d"
    }]
}, {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [{
        "color": "#17263c"
    }]
}];
const silverMapJson = [{
    "elementType": "geometry",
    "stylers": [{
        "color": "#f5f5f5"
    }]
}, {
    "elementType": "labels.icon",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#616161"
    }]
}, {
    "elementType": "labels.text.stroke",
    "stylers": [{
        "color": "#f5f5f5"
    }]
}, {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#bdbdbd"
    }]
}, {
    "featureType": "poi",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{
        "color": "#eeeeee"
    }]
}, {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#757575"
    }]
}, {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{
        "color": "#e5e5e5"
    }]
}, {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#9e9e9e"
    }]
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{
        "color": "#ffffff"
    }]
}, {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#757575"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{
        "color": "#dadada"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#616161"
    }]
}, {
    "featureType": "road.local",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#9e9e9e"
    }]
}, {
    "featureType": "transit",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{
        "color": "#e5e5e5"
    }]
}, {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{
        "color": "#eeeeee"
    }]
}, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{
        "color": "#c9c9c9"
    }]
}, {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#9e9e9e"
    }]
}];