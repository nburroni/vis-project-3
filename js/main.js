var map;
var directionsService;
var directionsDisplays = [];
var routes = [];
var clickedZone;
var subClickedZones = [];
var startTime;
var purpose;
var date;
var totalDest;
var totalOrigin;
var zoneColor = 0;
startTime = 10;
var color_range = d3.scaleLinear().domain([0, 500]).range(["rgba(253,212,158,.8)", "rgba(179,0,0,.8)"]);
var topCongestedList = {};
drawZones = [];
var closeInfoWindow = false;

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
var color_range = d3.scaleLinear().domain([0, 800]).range(["rgba(253,187,132,.8)", "rgba(127,0,0,.8)"]);
var color_range2 = d3.scaleLinear().domain([0, 800]).range(["rgba(250,159,181,.8)", "rgba(73,0,106,.8)"]);
var clicked = false;
var moused = false;
var destination = false;

var drawZones = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 28.3317,
            lng: -81.3246
        },
        zoom: 9,
        mapTypeControl: false,
        streetViewControl: false
    });
    map.mapTypes.set('styled_map', new google.maps.StyledMapType(silverMapJson));
    map.setMapTypeId('styled_map');
    if (!google.maps.Polygon.prototype.getBounds) {
        google.maps.Polygon.prototype.getBounds = function() {
            var bounds = new google.maps.LatLngBounds();
            this.getPath().forEach(function(element, index) {
                bounds.extend(element)
            });
            return bounds
        }
    }

    $('input#dark-mode').change(function() {
        map.mapTypes.set('styled_map', new google.maps.StyledMapType(this.checked ? darkMapJson : silverMapJson));
    });

    $('input#in-out-bound').change(function() {
        window.direction = this.checked ? 'outbound' : 'inbound';
    });

    var infowindow = new google.maps.InfoWindow();
    var legend = document.createElement('div');
    legend.id = 'legend';
    var content = [];
    content.push('<h3>Inbound Trips</h3>');
    content.push('<p><div class="color color1"></div>0 - 100</p>');
    content.push('<p><div class="color color2"></div>101 - 200</p>');
    content.push('<p><div class="color color3"></div>201 - 300</p>');
    content.push('<p><div class="color color4"></div>301 - 400</p>');
    content.push('<p><div class="color color5"></div>401 - 500</p>');
    content.push('<p><div class="color color6"></div>501 - 600</p>');
    legend.innerHTML = content.join('');
    legend.index = 1;

    var legend2 = document.createElement('div');
    legend2.id = 'legend2';
    var content2 = [];
    content2.push('<h3>Outbound Trips</h3>');
    content2.push('<p><div class="color color7"></div>0 - 100</p>');
    content2.push('<p><div class="color color8"></div>101 - 200</p>');
    content2.push('<p><div class="color color9"></div>201 - 300</p>');
    content2.push('<p><div class="color color10"></div>301 - 400</p>');
    content2.push('<p><div class="color color11"></div>401 - 500</p>');
    content2.push('<p><div class="color color12"></div>501 - 600</p>');
    legend2.innerHTML = content2.join('');
    legend2.index = 1;


    window.onDataReady = function(data, centers, GEO_JSON) {
        clickedZone = undefined;
        topCongestedList = data.topCongested;
        //console.log(topCongestedList);


        directionsService = new google.maps.DirectionsService();

        for (var i = 0; i < drawZones.length; i++) {
            drawZones[i].setOptions({
                fillColor: "rgba(0,0,0,.03)",
                strokeWeight: 0,
                fillOpacity: 1,
                zIndex: 0
            });
            drawZones[i].setColorValue = 0;
            drawZones[i].setMap(null);
        }
        directionsDisplays.forEach((d) => {
            d.setDirections({
                routes: []
            });
        });

        /********************************************************************************************
         ** Read each JSON feature object.Get coordinate and convert it into object {lat: ,lng:}
         ********************************************************************************************/

        // Check if the coordinates array is separated in multiple arrays
        GEO_JSON.features.forEach(function(polygon) {
            var coordinates = polygon.geometry.coordinates;
            // If more than one array is present, concat all the children into one array
            if (coordinates.length != 1) {
                polygon.geometry.coordinates = [].concat.apply([], coordinates);
            }
        });
        GEO_JSON.features.forEach(function(value, key) {
            //convert given coordinates array into
            var latlog = getLatlongMap(value.geometry.coordinates[0]);
            //console.log(value);

            var drawZone = new google.maps.Polygon({
                paths: latlog,
                strokeColor: "black",
                strokeOpacity: 0.2,
                strokeWeight: 1.5,
                fillColor: "green",
                fillOpacity: 0.4
            });
            drawZone.setMap(map);
            //console.log(value.properties.TAZ_ID);
            drawZone.zone = value.properties.TAZ_ID;
            drawZone.setColorValue = 0;

            google.maps.event.addListener(drawZone, 'click', function(event) {

				if (map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].length > 0) {
						map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].pop(legend4);
					}
					
                if (closeInfoWindow) {
                    infowindow.close();
                }
                if (clickedZone && clickedZone == value.properties) {
                    for (var i = 0; i < drawZones.length; i++) {
                        drawZones[i].setOptions({
                            fillColor: "green",
                            strokeWeight: 1.5,
                            fillOpacity: 0.2
                        });
                    }
                    if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length > 0) {
                        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                    }
					
					
					
                    directionsDisplays.forEach((d) => {
                        d.setDirections({
                            routes: []
                        });
                    });
                    clickedZone = undefined;
                } else if (clickedZone) {
                    var clicked = subClickedZones.find(function(d) {
                        return d == value.properties
                    });
                    if (clicked) {
                        subClickedZones.splice(subClickedZones.indexOf(clicked, 1));
                        directionsDisplays.forEach((d) => {
                            d.setDirections({
                                routes: []
                            });
                        });
                    } else {
                        subClickedZones = [];
                        var selectable = false;
                        data.data.forEach((d) => {
                            if (d.Destination_Zone == clickedZone.OBJECTID_1 && d.Origin_Zone == value.properties.OBJECTID_1) {
                                selectable = true;
                            }
                        });
                        if (selectable) {
                            directionsDisplays.forEach((d) => {
                                d.setDirections({
                                    routes: []
                                });
                            });
                            subClickedZones.push(value.properties);
                            calcRoute([{
                                sourceCenter: centers[value.properties.OBJECTID_1 - 1].center,
                                destCenter: centers[clickedZone.OBJECTID_1 - 1].center,
                                source: value.properties.OBJECTID_1,
                                dest: clickedZone.OBJECTID_1
                            }])
                        }
                    }
                } else {
                    // if (destination) {
                    //     for (var i = 0; i < data.data.length; i++) {
                    //
                    //         if (data.data[i].Destination_Zone == value.properties.OBJECTID_1) {
                    //
                    //             if (data.data[i].Origin_Zone - 1 < 1267) {
                    //
                    //                 drawZones[data.data[i].Origin_Zone - 1].setColorValue += Number(data.data[i].Count);
                    //                 zoneColor = drawZones[data.data[i].Origin_Zone - 1].setColorValue;
                    //                 drawZones[data.data[i].Origin_Zone - 1].setOptions({
                    //                     fillColor: color_range(drawZones[data.data[i].Origin_Zone - 1].setColorValue),
                    //                     strokeWeight: 2.0,
                    //                     fillOpacity: 1
                    //                 })
                    //             }
                    //         }
                    //     }
                    //     // Create the legend and display on the map
                    //     if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length < 1) {
                    //         map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
                    //     } else {
                    //         map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                    //         map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
                    //     }
                    // } else {
                    //
                    //     for (var i = 0; i < data.data.length; i++) {
                    //         if (data.data[i].Origin_Zone == value.properties.OBJECTID_1) {
                    //             if (data.data[i].Destination_Zone - 1 < 1267) {
                    //                 drawZones[data.data[i].Destination_Zone - 1].setColorValue += Number(data.data[i].Count);
                    //                 zoneColor = drawZones[data.data[i].Destination_Zone - 1].setColorValue;
                    //                 drawZones[data.data[i].Destination_Zone - 1].setOptions({
                    //                     fillColor: color_range2(drawZones[data.data[i].Destination_Zone - 1].setColorValue),
                    //                     strokeWeight: 2.0,
                    //                     fillOpacity: 1
                    //                 })
                    //             }
                    //         }
                    //     }
                    //
                    //     if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length < 1) {
                    //         map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend2);
                    //     } else {
                    //         map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend2);
                    //         map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend2);
                    //     }
                    //
                    // }else {
                    //
                    //     for (var i = 0; i < data.data.length; i++) {
                    //         if (data.data[i].Origin_Zone == value.properties.OBJECTID_1) {
                    //             if (data.data[i].Destination_Zone - 1 < 1267) {
                    //                 drawZones[data.data[i].Destination_Zone - 1].setColorValue += Number(data.data[i].Count);
                    //                 zoneColor = drawZones[data.data[i].Destination_Zone - 1].setColorValue;
                    //                 drawZones[data.data[i].Destination_Zone - 1].setOptions({
                    //                     fillColor: color_range2(drawZones[data.data[i].Destination_Zone - 1].setColorValue),
                    //                     strokeWeight: 2.0,
                    //                     fillOpacity: 1
                    //                 })
                    //             }
                    //         }
                    //     }
                    //
                    //     if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length < 1) {
                    //         map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend2);
                    //     } else {
                    //         map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend2);
                    //         map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend2);
                    //     }
                    //
                    // }
                    clickedZone = value.properties;
                    console.log("The zone clicked on is: " + value.properties.TAZ_ID);
                    for (var i = 0; i < drawZones.length; i++) {
                        drawZones[i].setOptions({
                            fillColor: "rgba(0,0,0,.03)",
                            strokeWeight: 0,
                            fillOpacity: 1,
                            zIndex: 0
                        });
                        drawZones[i].setColorValue = 0;
                    }

                    // Create the legend and display on the map
                    if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length < 1) {
                        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
                    } else {
                        console.log("test");
                        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
                    }


                    var routeCount = 0;
                    //Clear previous paths
                    directionsDisplays.forEach((d) => {
                        d.setDirections({
                            routes: []
                        });
                    });

                    directionsDisplays = [];
                    var zoneRoutes = [];
                    for (var i = 0; i < data.data.length; i++) {

                        if (data.data[i].Destination_Zone == value.properties.OBJECTID_1) {

                            if (data.data[i].Origin_Zone - 1 < 1267) {

                                drawZones[data.data[i].Origin_Zone - 1].setColorValue += Number(data.data[i].Count);
                                zoneColor = drawZones[data.data[i].Origin_Zone - 1].setColorValue;
                                drawZones[data.data[i].Origin_Zone - 1].setOptions({
                                    fillColor: color_range(drawZones[data.data[i].Origin_Zone - 1].setColorValue),
                                    strokeWeight: 2.0,
                                    fillOpacity: 1
                                });

                                //Draw the path between the two zones.
                                if (routeCount < 100) {
                                    zoneRoutes.push({
                                        sourceCenter: centers[data.data[i].Origin_Zone - 1].center,
                                        destCenter: centers[value.properties.OBJECTID_1 - 1].center,
                                        source: data.data[i].Origin_Zone,
                                        dest: value.properties.OBJECTID_1
                                    });
                                    routeCount++;
                                }
                            }
                        }
                    }

                    drawZone.setOptions({
                        fillColor: "green",
                        strokeWeight: 2.0,
                        fillOpacity: 0.4
                    });
                }

                button0.style.backgroundColor = 'lightgrey';
                button1.style.backgroundColor = 'lightgrey';
                button2.style.backgroundColor = 'lightgrey';
                button3.style.backgroundColor = 'lightgrey';
                button4.style.backgroundColor = 'lightgrey';
                button5.style.backgroundColor = 'lightgrey';
                button6.style.backgroundColor = 'lightgrey';
                button7.style.backgroundColor = 'lightgrey';
                button8.style.backgroundColor = 'lightgrey';
                button9.style.backgroundColor = 'lightgrey';
                buttonAll.style.backgroundColor = 'lightgrey';

            });
            google.maps.event.addListener(drawZone, 'mouseover', function(event) {

                moused = true;
                if (clickedZone) {
                    var selectable = false;
                    data.data.forEach((d) => {
                        if (d.Destination_Zone == clickedZone.OBJECTID_1 && d.Origin_Zone == value.properties.OBJECTID_1) {
                            selectable = true;
                        }
                    });
                    if (selectable) {
                        calcRoute([{
                            sourceCenter: centers[value.properties.OBJECTID_1 - 1].center,
                            destCenter: centers[clickedZone.OBJECTID_1 - 1].center,
                            source: value.properties.OBJECTID_1,
                            dest: clickedZone.OBJECTID_1
                        }]);
                    }
                    if (selectable || this.zone == clickedZone.OBJECTID_1) {
                        this.setOptions({
                            strokeColor: "black",
                            strokeOpacity: 1,
                            strokeWeight: 1.5
                        });
                    }
                } else {
                    this.setOptions({
                        strokeColor: "black",
                        strokeOpacity: 1,
                        strokeWeight: 1.5
                    });
                }


            });

            google.maps.event.addListener(drawZone, 'mouseout', function(event) {

                if (moused == true) {
                    moused = false;
                    this.setOptions({
                        strokeOpacity: 0.2

                    });
                }
                directionsDisplays.forEach((d) => {
                    if (!subClickedZones[0] || d.source != subClickedZones[0].OBJECTID_1) d.setDirections({
                        routes: []
                    });
                });

            });

            google.maps.event.addListener(drawZone, 'dblclick', function(event) {
                //Make all lighter
                //console.log("The zone clicked on is: " + drawZone);
                totalDest = 0;
                totalOrigin = 0;

                if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length > 0) {
                    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                }

                console.log(value.properties);
                infowindow.close();
                for (var i = 0; i < data.data.length; i++) {

                    if (data.data[i].Destination_Zone_Num == value.properties.OBJECTID_1) {
                        totalDest += Number(data.data[i].Count)
                    }
                    if (data.data[i].Origin_Zone_Num == value.properties.OBJECTID_1) {
                        totalOrigin += Number(data.data[i].Count)
                    }
                }

                infowindow.setContent("<p>Zone: " + value.properties.OBJECTID_1 + ".</p><p>County: " + value.properties.COUNTY + ".</p><p>Total Origin Trips: " + Math.ceil(totalOrigin) + ".</p><p>Total Destination Trips: " + Math.ceil(totalDest) + ".</p>");
                infowindow.setPosition(drawZone.getBounds().getCenter());
                infowindow.open(map);
                closeInfoWindow = true;
                for (var i = 0; i < drawZones.length; i++) {

                    drawZones[i].setOptions({
                        strokeColor: "black",
                        strokeOpacity: 0.2,
                        strokeWeight: 1.5,
                        fillColor: "green",
                        fillOpacity: 0.4
                    });
                }
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

            google.maps.event.addListener(map, 'zoom_changed', function(event) {
                //infowindow.close(map);

            });

            drawZones.push(drawZone);
        });

        /*var legend4 = document.createElement('div');
    legend4.id = 'legend4';
    var content4 = [];
    content4.push('<h3>Congestion Info</h3>');
    content4.push('<p>test</p>');
    legend4.innerHTML = content4.join('');
    legend4.index = 1;*/

        var legend3 = document.createElement('div');
        legend3.id = 'legend3';

        var content3 = [];
        content3.push('<h4>Top Ten Congested Trips</h4>');

        legend3.innerHTML = content3.join('');
        legend3.index = 1;

        var centerControl = new CenterControl(legend3, map);

        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(legend3);


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


function createButton(controlDiv, num) {
    var displayNum = num + 1;
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.id = "button" + num;
    controlUI.style.backgroundColor = 'lightgrey';
    controlUI.style.border = '3px solid black';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.style.width = '230px';
    controlUI.title = 'number of trips: ' + topCongestedList[num].Count_Num;
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '14px';
    controlText.style.lineHeight = '16px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = displayNum + ': From Zone ' + topCongestedList[num].Origin_Zone_Num + ' to Zone ' + topCongestedList[num].Destination_Zone_Num;
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
        //controlUI.style.backgroundColor = 'red';                      
        console.log("legend " + num + " Clicked");

        if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length > 0) {
            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
        }

        for (var i = 0; i < drawZones.length; i++) {


            if (drawZones[i].zone == topCongestedList[num].Origin_Zone_Num || drawZones[i].zone == topCongestedList[num].Destination_Zone_Num) {

                drawZones[i].setOptions({
                    fillColor: "rgba(255,0,0,1)",
                    strokeWeight: 4,
                    strokeColor: 'black',
                    fillOpacity: 1,
                });

            } else {

                drawZones[i].setOptions({
                    fillColor: "rgba(0,0,0,.03)",
                    strokeWeight: 0,
                    fillOpacity: 1,
                    zIndex: 0
                });
                //console.log(drawZones[i].zone);
            }

        }

        button0.style.backgroundColor = 'lightgrey';
        button1.style.backgroundColor = 'lightgrey';
        button2.style.backgroundColor = 'lightgrey';
        button3.style.backgroundColor = 'lightgrey';
        button4.style.backgroundColor = 'lightgrey';
        button5.style.backgroundColor = 'lightgrey';
        button6.style.backgroundColor = 'lightgrey';
        button7.style.backgroundColor = 'lightgrey';
        button8.style.backgroundColor = 'lightgrey';
        button9.style.backgroundColor = 'lightgrey';
        buttonAll.style.backgroundColor = 'lightgrey';
        controlUI.style.backgroundColor = 'red';

		console.log(topCongestedList);
		var legend4 = document.createElement('div');
    legend4.id = 'legend4';
    var content4 = [];
    content4.push('<h3>Congestion Info</h3>');
    content4.push("<p>Origination Zone: " + topCongestedList[num].Origin_Zone_Num + ".</p>");
	content4.push("<p>Originating County: " + topCongestedList[num].Origin_County + ".</p>");
	content4.push("<p>Destination Zone: " + topCongestedList[num].Destination_Zone_Num + ".</p>");
	content4.push("<p>Destination County: " + topCongestedList[num].Destination_County + ".</p>");
	content4.push("<p>Purpose of trips: " + topCongestedList[num].Purpose + ".</p>");
	content4.push("<p>Total Trips: " + Math.ceil(topCongestedList[num].Count_Num) + ".</p>");
    legend4.innerHTML = content4.join('');
    legend4.index = 1;
	
	
	// Create the legend and display on the map
                    if (map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].length < 1) {
                        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legend4);
                    } else {
                        console.log("test");
                        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].pop(legend4);
                        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legend4);
                    }


    });
}

function CenterControl(controlDiv, map) {

    createButton(controlDiv, 0);
    createButton(controlDiv, 1);
    createButton(controlDiv, 2);
    createButton(controlDiv, 3);
    createButton(controlDiv, 4);
    createButton(controlDiv, 5);
    createButton(controlDiv, 6);
    createButton(controlDiv, 7);
    createButton(controlDiv, 8);
    createButton(controlDiv, 9);

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.id = "buttonAll";
    controlUI.style.backgroundColor = 'lightgrey';
    controlUI.style.border = '3px solid black';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.style.width = '230px';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '14px';
    controlText.style.lineHeight = '28px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Show All';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {

        if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length > 0) {
            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
        }
		
		
        

        for (var i = 0; i < drawZones.length; i++) {


            if (drawZones[i].zone == topCongestedList[0].Origin_Zone_Num || drawZones[i].zone == topCongestedList[0].Destination_Zone_Num) {

                drawZones[i].setOptions({
                    fillColor: "rgba(255,0,0,1)",
                    strokeWeight: 4,
                    strokeColor: 'black',
                    fillOpacity: 1,
                });

            } else if (drawZones[i].zone == topCongestedList[1].Origin_Zone_Num || drawZones[i].zone == topCongestedList[1].Destination_Zone_Num) {

                drawZones[i].setOptions({
                    fillColor: "rgba(255,0,0,1)",
                    strokeWeight: 4,
                    strokeColor: 'black',
                    fillOpacity: 1,
                });

            } else if (drawZones[i].zone == topCongestedList[2].Origin_Zone_Num || drawZones[i].zone == topCongestedList[2].Destination_Zone_Num) {

                drawZones[i].setOptions({
                    fillColor: "rgba(255,0,0,1)",
                    strokeWeight: 4,
                    strokeColor: 'black',
                    fillOpacity: 1,
                });

            } else if (drawZones[i].zone == topCongestedList[3].Origin_Zone_Num || drawZones[i].zone == topCongestedList[3].Destination_Zone_Num) {

                drawZones[i].setOptions({
                    fillColor: "rgba(255,0,0,1)",
                    strokeWeight: 4,
                    strokeColor: 'black',
                    fillOpacity: 1,
                });

            } else if (drawZones[i].zone == topCongestedList[4].Origin_Zone_Num || drawZones[i].zone == topCongestedList[4].Destination_Zone_Num) {

                drawZones[i].setOptions({
                    fillColor: "rgba(255,0,0,1)",
                    strokeWeight: 4,
                    strokeColor: 'black',
                    fillOpacity: 1,
                });

            } else if (drawZones[i].zone == topCongestedList[5].Origin_Zone_Num || drawZones[i].zone == topCongestedList[5].Destination_Zone_Num) {

                drawZones[i].setOptions({
                    fillColor: "rgba(255,0,0,1)",
                    strokeWeight: 4,
                    strokeColor: 'black',
                    fillOpacity: 1,
                });

            } else if (drawZones[i].zone == topCongestedList[6].Origin_Zone_Num || drawZones[i].zone == topCongestedList[6].Destination_Zone_Num) {

                drawZones[i].setOptions({
                    fillColor: "rgba(255,0,0,1)",
                    strokeWeight: 4,
                    strokeColor: 'black',
                    fillOpacity: 1,
                });

            } else if (drawZones[i].zone == topCongestedList[7].Origin_Zone_Num || drawZones[i].zone == topCongestedList[7].Destination_Zone_Num) {

                drawZones[i].setOptions({
                    fillColor: "rgba(255,0,0,1)",
                    strokeWeight: 4,
                    strokeColor: 'black',
                    fillOpacity: 1,
                });

            } else if (drawZones[i].zone == topCongestedList[8].Origin_Zone_Num || drawZones[i].zone == topCongestedList[8].Destination_Zone_Num) {

                drawZones[i].setOptions({
                    fillColor: "rgba(255,0,0,1)",
                    strokeWeight: 4,
                    strokeColor: 'black',
                    fillOpacity: 1,
                });

            } else if (drawZones[i].zone == topCongestedList[9].Origin_Zone_Num || drawZones[i].zone == topCongestedList[9].Destination_Zone_Num) {

                drawZones[i].setOptions({
                    fillColor: "rgba(255,0,0,1)",
                    strokeWeight: 4,
                    strokeColor: 'black',
                    fillOpacity: 1,
                });

            } else {

                drawZones[i].setOptions({
                    fillColor: "rgba(0,0,0,.03)",
                    strokeWeight: 0,
                    fillOpacity: 1,
                    zIndex: 0
                });
                //console.log(drawZones[i].zone);
            }

        }

        button0.style.backgroundColor = 'lightgrey';
        button1.style.backgroundColor = 'lightgrey';
        button2.style.backgroundColor = 'lightgrey';
        button3.style.backgroundColor = 'lightgrey';
        button4.style.backgroundColor = 'lightgrey';
        button5.style.backgroundColor = 'lightgrey';
        button6.style.backgroundColor = 'lightgrey';
        button7.style.backgroundColor = 'lightgrey';
        button8.style.backgroundColor = 'lightgrey';
        button9.style.backgroundColor = 'lightgrey';
        controlUI.style.backgroundColor = 'red';
        console.log("legend Show All Clicked");
		
		
		var legend4 = document.createElement('div');
    legend4.id = 'legend4';
    var content4 = [];
    content4.push('<h3>Congestion Info</h3>');
    content4.push('<p>test</p>');
    legend4.innerHTML = content4.join('');
    legend4.index = 1;
	
	// Create the legend and display on the map
                    if (map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].length < 1) {
                        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legend4);
                    } else {
                        console.log("test");
                        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].pop(legend4);
                        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legend4);
                    }
    });

}

function calcRoute(zoneRoutes) {
    if (zoneRoutes[0].dest != clickedZone.OBJECTID_1) return;
    var route = routes[zoneRoutes[0].dest];
    var requestPaths = true;
    var stroke = {
        strokeColor: "#8539ff",
        strokeOpacity: 0.9,
        zIndex: 10
    };
    if (route) {
        route.sources.forEach((d) => {
            if (d.sourceId == zoneRoutes[0].source) {
                var directionsDisplay = new google.maps.DirectionsRenderer({
                    suppressMarkers: true,
                    polylineOptions: stroke,
                    preserveViewport: true
                });
                directionsDisplay.dest = zoneRoutes[0].dest;
                directionsDisplay.source = zoneRoutes[0].source;
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(d.path);
                directionsDisplays.push(directionsDisplay);
                requestPaths = false;
            }
        });
    }
    if (requestPaths) {
        if (!route) routes[zoneRoutes[0].dest] = {
            sources: []
        };
        var startPoint = zoneRoutes[0].sourceCenter;
        var endPoint = zoneRoutes[0].destCenter;
        var directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: stroke,
            preserveViewport: true,
            zIndex: 1000
        });
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
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.dest = zoneRoutes[0].dest;
                directionsDisplay.source = zoneRoutes[0].source;
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
                directionsDisplays.push(directionsDisplay);
                routes[zoneRoutes[0].dest].sources.push({
                    sourceId: zoneRoutes[0].source,
                    path: response
                });
                if (zoneRoutes.length > 1) {
                    zoneRoutes.splice(0, 1);
                    setTimeout(function() {
                        calcRoute(zoneRoutes);
                    }, 300);
                }
            } else {
                if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    console.log("limit reached");
                    setTimeout(function() {
                        calcRoute(zoneRoutes);
                    }, 300);

                } else {
                    alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                }
            }
        });
    } else if (zoneRoutes.length > 1) {
        zoneRoutes.splice(0, 1);
        calcRoute(zoneRoutes);
    }

}