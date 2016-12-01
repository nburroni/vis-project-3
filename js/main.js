var map;
var directionsService;
var directionsDisplays = [];
var routes = [];
var clickedZone;
var subClickedZones = [];
var startTime;
var purpose;
var date;
var zoneColor = 0;
startTime = 10;
var color_range = d3.scaleLinear().domain([0, 500]).range(["rgba(253,212,158,.8)", "rgba(179,0,0,.8)"]);

const darkMapJson = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];
const nightMapJson = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#242f3e"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#746855"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#242f3e"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#263c3f"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6b9a76"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#38414e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#212a37"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9ca5b3"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#746855"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#1f2835"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#f3d19c"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2f3948"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#17263c"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#515c6d"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#17263c"
            }
        ]
    }
];
const silverMapJson = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    }
];

function initMap() {
    let styledMapType = new google.maps.StyledMapType(silverMapJson);
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 28.3317,
            lng: -81.3246
        },
        zoom: 9,
        mapTypeControl: false,
        streetViewControl: false
    });
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
    if (!google.maps.Polygon.prototype.getBounds) {
        google.maps.Polygon.prototype.getBounds = function () {
            var bounds = new google.maps.LatLngBounds();
            this.getPath().forEach(function (element, index) {
                bounds.extend(element)
            });
            return bounds
        }
    }

    var infowindow = new google.maps.InfoWindow();
    var legend = document.createElement('div');
    legend.id = 'legend';
    var content = [];
    content.push('<h3>Inbound Trips</h3>');
    content.push('<p><div class="color red"></div>Battus</p>');
    content.push('<p><div class="color yellow"></div>Speyeria</p>');
    content.push('<p><div class="color green"></div>Papilio</p>');
    content.push('<p><div class="color blue"></div>Limenitis</p>');
    content.push('<p><div class="color purple"></div>Myscelia</p>');
    content.push('<p>*Data is fictional</p>');
    legend.innerHTML = content.join('');
    legend.index = 1;

    window.onDataReady = function (data, zones) {
        directionsService = new google.maps.DirectionsService();

        //zonesData = data;
        //console.log(data);

        var drawZones = [];
        /********************************************************************************************
         ** Read each JSON feature object.Get coordinate and convert it into object {lat: ,lng:}
         ********************************************************************************************/
        d3.json("./data/json/zones-geo.json", function (err, GEO_JSON) {
            d3.json("./data/json/zone-centers.json", function (err, centers) {
                // Check if the coordinates array is separated in multiple arrays
                GEO_JSON.features.forEach(function (polygon) {
                    var coordinates = polygon.geometry.coordinates;
                    // If more than one array is present, concat all the children into one array
                    if (coordinates.length != 1) {
                        polygon.geometry.coordinates = [].concat.apply([], coordinates);
                    }
                });
                GEO_JSON.features.forEach(function (value, key) {
                    //convert given coordinates array into
                    var latlog = getLatlongMap(value.geometry.coordinates[0]);
                    //console.log(value);

                    var drawZone = new google.maps.Polygon({
                        paths: latlog,
                        strokeColor: "black",
                        strokeOpacity: 0.2,
                        strokeWeight: 1.5,
                        fillColor: "green",
                        fillOpacity: 0.2
                    });
                    drawZone.setMap(map);

                    drawZone.zone = value.properties.OBJECTID_1;
                    drawZone.setColorValue = 0;

                    google.maps.event.addListener(drawZone, 'click', function (event) {

                        if (clickedZone && clickedZone == value.properties){
                            for (var i = 0; i < drawZones.length; i++) {
                                drawZones[i].setOptions({fillColor: "green", strokeWeight: 1.5, fillOpacity: 0.2});
                            }
                            directionsDisplays.forEach((d) => {
                                d.setDirections({routes: []});
                            });
                            clickedZone = undefined;
                        }
                        else if (clickedZone) {
                            directionsDisplays.forEach((d) => {
                                d.setDirections({routes: []});
                            });
                            var clicked = subClickedZones.find(function (d){return d == value.properties});
                            if (clicked){
                                subClickedZones.splice(subClickedZones.indexOf(clicked, 1));
                            }
                            else{
                                subClickedZones.push (value.properties);
                                calcRoute([{sourceCenter: centers[value.properties.OBJECTID_1 - 1].center, destCenter: centers[clickedZone.OBJECTID_1 - 1].center, source: value.properties.OBJECTID_1, dest: clickedZone.OBJECTID_1}])
                            }
                        }
                        else{
                            clickedZone = value.properties;
                            console.log("The zone clicked on is: " + value.properties.OBJECTID_1);
                            //console.log(value.properties);
                            //console.log(data.data[0].Destination_Zone);
                            //console.log(drawZones.length);
                            for (var i = 0; i < drawZones.length; i++) {

                                drawZones[i].setOptions({fillColor: "rgba(0,0,0,.03)", strokeWeight: 0, fillOpacity: 1});
                                drawZones[i].setColorValue = 0;
                            }

                            //map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
                            //document.getElementById('legend'));

                            // Create the legend and display on the map
                            if(map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length < 1){
                                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
                            }
                            else {
                                console.log("test");
                                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
                            }


                            var routeCount = 0;
                            //Clear previous paths
                            directionsDisplays.forEach((d) => {
                                d.setDirections({routes: []});
                            });
                            directionsDisplays = [];
                            var zoneRoutes = [];
                            for(var i = 0; i < data.data.length; i++){
                                //console.log(data.data[i].Origin_Zone);
                                if (data.data[i].Destination_Zone == value.properties.OBJECTID_1) {
                                    //console.log(data.data[i].Destination_Zone);
                                    //zoneColor++;
                                    //console.log(value.properties.OBJECTID_1);
                                    //console.log(drawZones[data.data[i].Origin_Zone - 1]);


                                    if (data.data[i].Origin_Zone - 1 < 1267) {


                                        drawZones[data.data[i].Origin_Zone - 1].setColorValue += Number(data.data[i].Count);
                                        //console.log(data.data[i].Count);
                                        //console.log(drawZones[data.data[i].Origin_Zone - 1].setColorValue);
                                        zoneColor = drawZones[data.data[i].Origin_Zone - 1].setColorValue;
                                        //console.log(zoneColor);
                                        //console.log(drawZones[data.data[i].Origin_Zone - 1].setColorValue);
                                        //console.log(color_range(drawZones[data.data[i].Origin_Zone - 1].setColorValue));
                                        drawZones[data.data[i].Origin_Zone - 1].setOptions({
                                            fillColor: color_range(drawZones[data.data[i].Origin_Zone - 1].setColorValue),
                                            strokeWeight: 2.0,
                                            fillOpacity: 1
                                        });
                                        //drawZones[data.data[i].Origin_Zone - 1].setOptions({fillColor: "blue",strokeWeight: 2.0,fillOpacity: 0.4})
                                        //drawZones[data.data[i].Origin_Zone - 1].setFillColor("zoneColor,0,0)");
                                        google.maps.event.addListener(drawZones[data.data[i].Origin_Zone - 1], 'mouseover', function (event){
                                            // console.log ('Entered zone ' + this.zone);
                                            // directionsDisplays.forEach((d) => {
                                            //     if (d.source != this.zone){
                                            //         var minOpacity = 0.0;
                                            //         var opacity = 0.2;
                                            //         function opacityTransition(opacity){
                                            //             if (d.polylineOptions.strokeOpacity > minOpacity){
                                            //                 d.polylineOptions.strokeOpacity = opacity;
                                            //                 d.setMap(map);
                                            //                 opacity = opacity - 0.1;
                                            //                 setTimeout(function (){opacityTransition(opacity)}, 50);
                                            //             }
                                            //         }
                                            //         setTimeout(function (){opacityTransition(opacity)}, 50);
                                            //     }
                                            //     else{
                                            //         d.polylineOptions.strokeColor = "red";
                                            //         d.polylineOptions.strokeOpacity = 0.7;
                                            //         d.setMap(map);
                                            //     }
                                            // });
                                        });
                                        google.maps.event.addListener(drawZones[data.data[i].Origin_Zone - 1], 'mouseout', function (event){

                                        });
                                        //Draw the path between the two zones.
                                        if (routeCount < 100){
                                            zoneRoutes.push({sourceCenter: centers[data.data[i].Origin_Zone - 1].center, destCenter: centers[value.properties.OBJECTID_1 - 1].center, source: data.data[i].Origin_Zone, dest: value.properties.OBJECTID_1});
                                            routeCount++;
                                        }
                                    }
                                }
                            }
                            // calcRoute(zoneRoutes);
                            //Make selected darker
                            drawZone.setOptions({
                                fillColor: "green",
                                strokeWeight: 2.0,
                                fillOpacity: 0.4
                            });

                            //Get bound for polygon// calculate the bounds of the polygon
                            //var bounds = new google.maps.LatLngBounds();
                        }
                    });

                    google.maps.event.addListener(drawZone, 'dblclick', function (event) {
                        //Make all lighter
                        //console.log("The zone clicked on is: " + drawZone);
                        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                        console.log(value.properties);
                        infowindow.close();
                        infowindow.setContent("<p>Zone: " + value.properties.OBJECTID_1 + ".</p><p>County: " + value.properties.COUNTY + ".</p>");
                        infowindow.setPosition(drawZone.getBounds().getCenter());
                        infowindow.open(map);
                        for (var i = 0; i < drawZones.length; i++) {

                            drawZones[i].setOptions({
                                strokeColor: "black",
                                strokeOpacity: 0.2,
                                strokeWeight: 1.5,
                                fillColor: "green",
                                fillOpacity: 0.4
                            });
                        }

                        //console.log("The zone clicked on is: " + value.properties.OBJECTID_1);
                        //console.log("The Bounds are: " + drawZone.getBounds());

                        //map.panToBounds(drawZone.getBounds());
                        map.fitBounds(drawZone.getBounds());
                        console.log("The zoom level is: " + map.getZoom());
                        map.setZoom(map.getZoom() - 1);
                        console.log("The next zoom level is: " + map.getZoom());
                        if (map.getZoom() > 14) {
                            map.setZoom(14);
                            console.log("The new zoom level is: " + map.getZoom());
                        }
                        map.setCenter(drawZone.getBounds().getCenter());
                    });

                    drawZones.push(drawZone);
                });

                // Draw red circles in center of each polygon
                /*centers.forEach(function(d) {
                 var cityCircle = new google.maps.Circle({
                 strokeColor: '#FF0000',
                 strokeOpacity: 0.8,
                 strokeWeight: 2,
                 fillColor: '#FF0000',
                 fillOpacity: 0.70,
                 center: new google.maps.LatLng(d.center.lat, d.center.lng),
                 radius: 200
                 });
                 cityCircle.setMap(map);
                 });*/
            });
        });
    }
}


/********************************************************************************************
 **  Function converts coordinates array into {lang:,lat:} and return array of such object
 ********************************************************************************************/
function getLatlongMap(coordinatesArray) {
    var latLongMap = [];
    for (var i in coordinatesArray) {
        latLongMap.push({
            'lng': coordinatesArray[i][0],
            'lat': coordinatesArray[i][1]
        })
    }
    return latLongMap;
}

function calcRoute(zoneRoutes) {
    if (zoneRoutes[0].dest != clickedZone.OBJECTID_1) return;
    var route = routes[zoneRoutes[0].dest];
    var requestPaths = true;
    var stroke = {
        strokeColor: "#8539ff",
        strokeOpacity: 0.9
    };
    if (route){
        route.sources.forEach((d) => {
            if (d.sourceId == zoneRoutes[0].source){
                var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, polylineOptions: stroke, preserveViewport: true});
                directionsDisplay.dest = zoneRoutes[0].dest;
                directionsDisplay.source = zoneRoutes[0].source;
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(d.path);
                directionsDisplays.push(directionsDisplay);
                requestPaths = false;
            }
        });
    }
    if (requestPaths){
        if (!route) routes[zoneRoutes[0].dest] = {sources: []};
        var startPoint = zoneRoutes[0].sourceCenter;
        var endPoint = zoneRoutes[0].destCenter;
        var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, polylineOptions: stroke, preserveViewport: true, zIndex: 1000});
        directionsDisplay.setMap(map);

        var start = new google.maps.LatLng(startPoint.lat, startPoint.lng);
        var end = new google.maps.LatLng(endPoint.lat, endPoint.lng);

        var bounds = new google.maps.LatLngBounds();
        bounds.extend(start);
        bounds.extend(end);
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.dest = zoneRoutes[0].dest;
                directionsDisplay.source = zoneRoutes[0].source;
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
                directionsDisplays.push(directionsDisplay);
                routes[zoneRoutes[0].dest].sources.push({sourceId: zoneRoutes[0].source, path: response});
                if (zoneRoutes.length > 1) {
                    zoneRoutes.splice(0,1);
                    setTimeout(function () {calcRoute(zoneRoutes);}, 300);
                }
            } else {
                if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    console.log ("limit reached");
                    setTimeout(function (){calcRoute(zoneRoutes);}, 300);

                } else {
                    alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                }
            }
        });
    }
    else if (zoneRoutes.length > 1) {
        zoneRoutes.splice(0, 1);
        calcRoute(zoneRoutes);
    }

}