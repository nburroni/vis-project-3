var map;
var directionsService;
var directionsDisplay;
var startTime;
var purpose;
var date;
var totalDest;
var totalOrigin;
var zoneColor = 0;
startTime = 10;
var color_range = d3.scaleLinear().domain([0, 800]).range(["rgba(253,187,132,.8)", "rgba(127,0,0,.8)"]);
var color_range2 = d3.scaleLinear().domain([0, 800]).range(["rgba(250,159,181,.8)", "rgba(73,0,106,.8)"]);
var clicked = false;
var moused = false;
var destination = false;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 28.3317,
            lng: -81.3246
        },
        zoom: 9
    });
    if (!google.maps.Polygon.prototype.getBounds) {
        google.maps.Polygon.prototype.getBounds = function() {
            var bounds = new google.maps.LatLngBounds();
            this.getPath().forEach(function(element, index) {
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

    var legend3 = document.createElement('div');
    legend3.id = 'legend3';

    var content3 = [];
    content3.push('<h3>Top Ten Congested Areas</h3>');

    legend3.innerHTML = content3.join('');
    legend3.index = 1;

    var centerControl = new CenterControl(legend3, map);

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(legend3);

    window.onDataReady = function(data, zones) {
        directionsService = new google.maps.DirectionsService();

        var drawZones = [];
        /********************************************************************************************
         ** Read each JSON feature object.Get coordinate and convert it into object {lat: ,lng:}
         ********************************************************************************************/
        d3.json("./data/json/zones-geo.json", function(err, GEO_JSON) {
            d3.json("./data/json/zone-centers.json", function(err, centers) {
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

                    drawZone.zone = value.properties.OBJECTID_1;
                    drawZone.setColorValue = 0;


                    // Create the legend and display on the map
                    if (map.controls[google.maps.ControlPosition.RIGHT_TOP].length < 1) {
                        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend3);
                    } else {
                        map.controls[google.maps.ControlPosition.RIGHT_TOP].pop(legend3);
                        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend3);
                    }

                    google.maps.event.addListener(drawZone, 'click', function(event) {

                        if (clicked == false) {
                            clicked = true;
                            console.log("The zone clicked on is: " + value.properties.OBJECTID_1);
                            for (var i = 0; i < drawZones.length; i++) {

                                drawZones[i].setOptions({
                                    fillColor: "rgba(0,0,0,.0)",
                                    strokeWeight: 0,
                                    fillOpacity: 1
                                });
                                drawZones[i].setColorValue = 0;
                            }
                            if (destination) {
                                for (var i = 0; i < data.data.length; i++) {

                                    if (data.data[i].Destination_Zone == value.properties.OBJECTID_1) {

                                        if (data.data[i].Origin_Zone - 1 < 1267) {

                                            drawZones[data.data[i].Origin_Zone - 1].setColorValue += Number(data.data[i].Count);
                                            zoneColor = drawZones[data.data[i].Origin_Zone - 1].setColorValue;
                                            drawZones[data.data[i].Origin_Zone - 1].setOptions({
                                                fillColor: color_range(drawZones[data.data[i].Origin_Zone - 1].setColorValue),
                                                strokeWeight: 2.0,
                                                fillOpacity: 1
                                            })
                                        }
                                    }
                                }
                                // Create the legend and display on the map
                                if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length < 1) {
                                    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
                                } else {
                                    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                                    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
                                }
                            } else {

                                for (var i = 0; i < data.data.length; i++) {
                                    if (data.data[i].Origin_Zone == value.properties.OBJECTID_1) {
                                        if (data.data[i].Destination_Zone - 1 < 1267) {
                                            drawZones[data.data[i].Destination_Zone - 1].setColorValue += Number(data.data[i].Count);
                                            zoneColor = drawZones[data.data[i].Destination_Zone - 1].setColorValue;
                                            drawZones[data.data[i].Destination_Zone - 1].setOptions({
                                                fillColor: color_range2(drawZones[data.data[i].Destination_Zone - 1].setColorValue),
                                                strokeWeight: 2.0,
                                                fillOpacity: 1
                                            })
                                        }
                                    }
                                }

                                if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length < 1) {
                                    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend2);
                                } else {
                                    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend2);
                                    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend2);
                                }

                            }


                            //Make selected darker
                            drawZone.setOptions({
                                fillColor: "green",
                                strokeWeight: 2.0,
                                fillOpacity: 1.0
                            });

                        } else {
                            clicked = false;
                            moused = false;
                            for (var i = 0; i < drawZones.length; i++) {

                                drawZones[i].setOptions({
                                    strokeColor: "black",
                                    strokeOpacity: 0.2,
                                    strokeWeight: 1.5,
                                    fillColor: "green",
                                    fillOpacity: 0.4
                                });
                                drawZones[i].setColorValue = 0;
                            }
                            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                        }

                    });


                    google.maps.event.addListener(drawZone, 'mouseover', function(event) {

                        if (drawZone.strokeWeight == 0) {
                            moused = true;
                            drawZone.setOptions({
                                strokeColor: "black",
                                strokeOpacity: 0.2,
                                strokeWeight: 1.5,
                                fillColor: "green",
                                fillOpacity: 0.4
                            });
                        }

                    });

                    google.maps.event.addListener(drawZone, 'mouseout', function(event) {

                        if (moused == true) {
                            moused = false;
                            drawZone.setOptions({
                                fillColor: "rgba(0,0,0,.0)",
                                strokeWeight: 0,
                                fillOpacity: 1

                            });
                        }

                    });

                    google.maps.event.addListener(drawZone, 'dblclick', function(event) {
                        //Make all lighter
                        //console.log("The zone clicked on is: " + drawZone);
                        totalDest = 0;
                        totalOrigin = 0;
                        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
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

function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'grey';
    controlUI.style.border = '2px solid black';
    controlUI.style.borderRadius = '4px';
    controlUI.style.boxShadow = '0 1px 2px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '4px';
    controlUI.style.textAlign = 'center';
    controlUI.style.width = '30px';
    controlUI.title = '1';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '16px';
    controlText.style.paddingLeft = '2px';
    controlText.style.paddingRight = '2px';
    controlText.innerHTML = '1';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
        console.log("legend Clicked");
    });

    // Set CSS for the control border.
    var controlUI2 = document.createElement('div');
    controlUI2.style.backgroundColor = 'grey';
    controlUI2.style.border = '3px solid black';
    controlUI2.style.borderRadius = '3px';
    controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI2.style.cursor = 'pointer';
    controlUI2.style.marginBottom = '10px';
    controlUI2.style.textAlign = 'center';
    controlUI.style.width = '30px';
    controlUI2.style.width = '30px';
    controlUI2.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI2);

    // Set CSS for the control interior.
    var controlText2 = document.createElement('div');
    controlText2.style.color = 'rgb(25,25,25)';
    controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText2.style.fontSize = '16px';
    controlText2.style.lineHeight = '16px';
    controlText2.style.paddingLeft = '5px';
    controlText2.style.paddingRight = '5px';
    controlText2.innerHTML = '2';
    controlUI2.appendChild(controlText2);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI2.addEventListener('click', function() {
        console.log("legend 2 Clicked");
    });

    // Set CSS for the control border.
    var controlUI3 = document.createElement('div');
    controlUI3.style.backgroundColor = 'grey';
    controlUI3.style.border = '3px solid black';
    controlUI3.style.borderRadius = '3px';
    controlUI3.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI3.style.cursor = 'pointer';
    controlUI3.style.marginBottom = '10px';
    controlUI3.style.textAlign = 'center';
    controlUI3.style.width = '30px';
    controlUI3.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI3);

    // Set CSS for the control interior.
    var controlText3 = document.createElement('div');
    controlText3.style.color = 'rgb(25,25,25)';
    controlText3.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText3.style.fontSize = '16px';
    controlText3.style.lineHeight = '16px';
    controlText3.style.paddingLeft = '5px';
    controlText3.style.paddingRight = '5px';
    controlText3.innerHTML = '3';
    controlUI3.appendChild(controlText3);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI3.addEventListener('click', function() {
        console.log("legend 3 Clicked");
    });

    // Set CSS for the control border.
    var controlUI2 = document.createElement('div');
    controlUI2.style.backgroundColor = 'grey';
    controlUI2.style.border = '3px solid black';
    controlUI2.style.borderRadius = '3px';
    controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI2.style.cursor = 'pointer';
    controlUI2.style.marginBottom = '10px';
    controlUI2.style.textAlign = 'center';
    controlUI2.style.width = '30px';
    controlUI2.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI2);

    // Set CSS for the control interior.
    var controlText2 = document.createElement('div');
    controlText2.style.color = 'rgb(25,25,25)';
    controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText2.style.fontSize = '16px';
    controlText2.style.lineHeight = '16px';
    controlText2.style.paddingLeft = '5px';
    controlText2.style.paddingRight = '5px';
    controlText2.innerHTML = '4';
    controlUI2.appendChild(controlText2);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI2.addEventListener('click', function() {
        console.log("legend 4 Clicked");
    });

    // Set CSS for the control border.
    var controlUI2 = document.createElement('div');
    controlUI2.style.backgroundColor = 'grey';
    controlUI2.style.border = '3px solid black';
    controlUI2.style.borderRadius = '3px';
    controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI2.style.cursor = 'pointer';
    controlUI2.style.marginBottom = '10px';
    controlUI2.style.textAlign = 'center';
    controlUI2.style.width = '30px';
    controlUI2.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI2);

    // Set CSS for the control interior.
    var controlText2 = document.createElement('div');
    controlText2.style.color = 'rgb(25,25,25)';
    controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText2.style.fontSize = '16px';
    controlText2.style.lineHeight = '16px';
    controlText2.style.paddingLeft = '5px';
    controlText2.style.paddingRight = '5px';
    controlText2.innerHTML = '5';
    controlUI2.appendChild(controlText2);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI2.addEventListener('click', function() {
        console.log("legend 5 Clicked");
    });

    // Set CSS for the control border.
    var controlUI2 = document.createElement('div');
    controlUI2.style.backgroundColor = 'grey';
    controlUI2.style.border = '3px solid black';
    controlUI2.style.borderRadius = '3px';
    controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI2.style.cursor = 'pointer';
    controlUI2.style.marginBottom = '10px';
    controlUI2.style.textAlign = 'center';
    controlUI2.style.width = '30px';
    controlUI2.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI2);

    // Set CSS for the control interior.
    var controlText2 = document.createElement('div');
    controlText2.style.color = 'rgb(25,25,25)';
    controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText2.style.fontSize = '16px';
    controlText2.style.lineHeight = '16px';
    controlText2.style.paddingLeft = '5px';
    controlText2.style.paddingRight = '5px';
    controlText2.innerHTML = '6';
    controlUI2.appendChild(controlText2);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI2.addEventListener('click', function() {
        console.log("legend 6 Clicked");
    });

    // Set CSS for the control border.
    var controlUI2 = document.createElement('div');
    controlUI2.style.backgroundColor = 'grey';
    controlUI2.style.border = '3px solid black';
    controlUI2.style.borderRadius = '3px';
    controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI2.style.cursor = 'pointer';
    controlUI2.style.marginBottom = '10px';
    controlUI2.style.textAlign = 'center';
    controlUI2.style.width = '30px';
    controlUI2.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI2);

    // Set CSS for the control interior.
    var controlText2 = document.createElement('div');
    controlText2.style.color = 'rgb(25,25,25)';
    controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText2.style.fontSize = '16px';
    controlText2.style.lineHeight = '16px';
    controlText2.style.paddingLeft = '5px';
    controlText2.style.paddingRight = '5px';
    controlText2.innerHTML = '7';
    controlUI2.appendChild(controlText2);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI2.addEventListener('click', function() {
        console.log("legend 7 Clicked");
    });

    // Set CSS for the control border.
    var controlUI2 = document.createElement('div');
    controlUI2.style.backgroundColor = 'grey';
    controlUI2.style.border = '3px solid black';
    controlUI2.style.borderRadius = '3px';
    controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI2.style.cursor = 'pointer';
    controlUI2.style.marginBottom = '10px';
    controlUI2.style.textAlign = 'center';
    controlUI2.style.width = '30px';
    controlUI2.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI2);

    // Set CSS for the control interior.
    var controlText2 = document.createElement('div');
    controlText2.style.color = 'rgb(25,25,25)';
    controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText2.style.fontSize = '16px';
    controlText2.style.lineHeight = '16px';
    controlText2.style.paddingLeft = '5px';
    controlText2.style.paddingRight = '5px';
    controlText2.innerHTML = '8';
    controlUI2.appendChild(controlText2);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI2.addEventListener('click', function() {
        console.log("legend 8 Clicked");
    });

    // Set CSS for the control border.
    var controlUI2 = document.createElement('div');
    controlUI2.style.backgroundColor = 'grey';
    controlUI2.style.border = '3px solid black';
    controlUI2.style.borderRadius = '3px';
    controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI2.style.cursor = 'pointer';
    controlUI2.style.marginBottom = '10px';
    controlUI2.style.textAlign = 'center';
    controlUI2.style.width = '30px';
    controlUI2.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI2);

    // Set CSS for the control interior.
    var controlText2 = document.createElement('div');
    controlText2.style.color = 'rgb(25,25,25)';
    controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText2.style.fontSize = '16px';
    controlText2.style.lineHeight = '16px';
    controlText2.style.paddingLeft = '5px';
    controlText2.style.paddingRight = '5px';
    controlText2.innerHTML = '9';
    controlUI2.appendChild(controlText2);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI2.addEventListener('click', function() {
        console.log("legend 9 Clicked");
    });

    // Set CSS for the control border.
    var controlUI2 = document.createElement('div');
    controlUI2.style.backgroundColor = 'grey';
    controlUI2.style.border = '3px solid black';
    controlUI2.style.borderRadius = '3px';
    controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI2.style.cursor = 'pointer';
    controlUI2.style.marginBottom = '10px';
    controlUI2.style.textAlign = 'center';
    controlUI2.style.width = '30px';
    controlUI2.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI2);

    // Set CSS for the control interior.
    var controlText2 = document.createElement('div');
    controlText2.style.color = 'rgb(25,25,25)';
    controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText2.style.fontSize = '16px';
    controlText2.style.lineHeight = '16px';
    controlText2.style.paddingLeft = '5px';
    controlText2.style.paddingRight = '5px';
    controlText2.innerHTML = '10';
    controlUI2.appendChild(controlText2);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI2.addEventListener('click', function() {
        console.log("legend 10 Clicked");
    });

    // Set CSS for the control border.
    var controlUI2 = document.createElement('div');
    controlUI2.style.backgroundColor = 'grey';
    controlUI2.style.border = '3px solid black';
    controlUI2.style.borderRadius = '3px';
    controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI2.style.cursor = 'pointer';
    controlUI2.style.marginBottom = '10px';
    controlUI2.style.textAlign = 'center';
    controlUI2.style.width = '80px';
    controlUI2.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI2);

    // Set CSS for the control interior.
    var controlText2 = document.createElement('div');
    controlText2.style.color = 'rgb(25,25,25)';
    controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText2.style.fontSize = '16px';
    controlText2.style.lineHeight = '28px';
    controlText2.style.paddingLeft = '5px';
    controlText2.style.paddingRight = '5px';
    controlText2.innerHTML = 'Show All';
    controlUI2.appendChild(controlText2);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI2.addEventListener('click', function() {
        console.log("legend Show All Clicked");
    });

}

function calcRoute(startPoint, endPoint) {
    var directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: "blue"
        }
    });
    directionsDisplay.setMap(map);

    var start = new google.maps.LatLng(startPoint.lat, startPoint.lng);
    var end = new google.maps.LatLng(endPoint.lat, endPoint.lng);

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
        } else {
            if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                console.log("limit reached");
            } else {
                alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
        }
    });
}