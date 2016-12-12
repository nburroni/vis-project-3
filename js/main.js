(function () {
    let map;
    let infowindow;
    let directionsService;
    let directionsDisplays = [];
    let routes = [];
    let clickedZone;
    let subClickedZones = [];
    let totalDest;
    let totalOrigin;
    let closeInfoWindow = false;
    let markers = {};
    let maxZoneNum = 1267;
    window.places = ['catholic churches', 'jewish temples', 'attractions', 'malls'];

    const rangeMin = 0;
    const rangeMax = 500;
    const colorScaleInbound = d3.scaleLinear().domain([rangeMin, rangeMax]).range(["rgba(253,187,132,.8)", "rgba(127,0,0,.8)"]);
    const colorScaleOutbound = d3.scaleLinear().domain([rangeMin, rangeMax]).range(["rgba(250,159,181,.8)", "rgba(73,0,106,.8)"]);
    const colorScaleInboundTotal = d3.scaleLinear().domain([rangeMin, rangeMax * 30]).range(["rgba(253,187,132,.8)", "rgba(127,0,0,.8)"]);
    const colorScaleOutboundTotal = d3.scaleLinear().domain([rangeMin, rangeMax * 30]).range(["rgba(250,159,181,.8)", "rgba(73,0,106,.8)"]);
    let zoneTotalColors = {};
    let moused = false;

    let drawZones = [];

    let getRouteColor = () => direction == 'inbound' ? "#00ff95" : "#00ff95";

    let fillMarkers = () => {
        infowindow = new google.maps.InfoWindow();
        let currentPlaceIndex = 0;

        let reqPlaces = () => {
            let service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: new google.maps.LatLng(28.535515, -81.382955),
                radius: 30000,
                name: places[currentPlaceIndex]
            }, placeMarkers);
        };
        reqPlaces();

        function placeMarkers(results, status, pagination) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
            if (pagination.hasNextPage) pagination.nextPage();
            else if (currentPlaceIndex + 1 < places.length) {
                currentPlaceIndex++;
                reqPlaces();
            } else d3.select('#loader').classed('hidden', true);
        }

        function createMarker(place) {
            let marker = new google.maps.Marker({
                map: null,
                position: place.geometry.location
            });
            let name = places[currentPlaceIndex];
            if (!markers[name]) markers[name] = [];
            markers[name].push(marker);
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        }
    };

    window.showMarkers = (name) => {
        Object.keys(markers).forEach(k => {
            if (markers.hasOwnProperty(k)) {
                if (k == name)
                    markers[k].forEach(m => m.setMap(map));
                else
                    markers[k].forEach(m => m.setMap(null));
            }
        })
    };

    window.hideMarkers = () => {
        Object.keys(markers).forEach(k => {
            if (markers.hasOwnProperty(k)) {
                markers[k].forEach(m => m.setMap(null));
            }
        })
    };

    window.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 28.3317,
                lng: -81.3246
            },
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false
        });
        map.mapTypes.set('styled_map', new google.maps.StyledMapType(silverMapJson));
        map.setMapTypeId('styled_map');
        if (!google.maps.Polygon.prototype.getBounds) {
            google.maps.Polygon.prototype.getBounds = function () {
                let bounds = new google.maps.LatLngBounds();
                this.getPath().forEach(function (element, index) {
                    bounds.extend(element)
                });
                return bounds
            }
        }

        fillMarkers();

        $('input#dark-mode').change(function () {
            map.mapTypes.set('styled_map', new google.maps.StyledMapType(this.checked ? darkMapJson : silverMapJson));
        });

        let inboundLegend = document.createElement('div');
        let outboundLegend = document.createElement('div');
        inboundLegend.id = 'inboundLegend';
        outboundLegend.id = 'outboundLegend';
        // inboundLegend.innerHTML = '<div class="trip-legend-title"><h3>Inbound Trips</h3></div>';
        // outboundLegend.innerHTML = '<div class="trip-legend-title"><h3>Outbound Trips</h3></div>';

        d3.range(1, 7).forEach(i => {
            let prev = Math.ceil((rangeMax / 6) * (i - 1));
            let num = Math.ceil((rangeMax / 6) * i);

            let infowindow = new google.maps.InfoWindow();
            inboundLegend.innerHTML += `<div class="color color${i}">${prev} - ${num}</div>`;
            outboundLegend.innerHTML += `<div class="color color${i + 6}">${prev} - ${num}</div>`;
        });
        inboundLegend.index = 1;
        outboundLegend.index = 1;

        directionsService = new google.maps.DirectionsService();

        window.onDataReady = function (data, centers, GEO_JSON, holidays) {
            let clearAll = () => {
                clickedZone = undefined;
                drawZones.forEach(dz => dz.setMap(null));
                clearPaths();
            };
            let selectZone = (clickedZoneId) => {
                let drawZone = drawZones.find(dz => dz.zone == clickedZoneId);
                drawZones.forEach(dz =>
                    dz.setOptions({
                        fillColor: "rgba(0,0,0,.03)",
                        strokeWeight: 0,
                        fillOpacity: 1,
                        zIndex: 0,
                        map: map
                    })
                );
                let legendToMove;
                if (direction == 'inbound') {
                    let inbound = {};
                    data.data.filter(d => d.Destination_Zone_Num == clickedZoneId).forEach(d => {
                        if (!inbound[d.Origin_Zone_Clean]) inbound[d.Origin_Zone_Clean] = 0;
                        inbound[d.Origin_Zone_Clean] += d.Count_Num;
                    });
                    Object.keys(inbound).forEach(originId => {
                        drawZones.find(dz => dz.zone == originId).setOptions({
                            fillColor: colorScaleInbound(inbound[originId]),
                            strokeWeight: 2.0,
                            fillOpacity: 1
                        })
                    });
                    legendToMove = inboundLegend;
                } else {
                    let outbound = {};
                    data.data.filter(d => d.Origin_Zone_Num == clickedZoneId).forEach(d => {
                        if (!outbound[d.Destination_Zone_Clean]) outbound[d.Destination_Zone_Clean] = 0;
                        outbound[d.Destination_Zone_Clean] += d.Count_Num;
                    });
                    Object.keys(outbound).forEach(destId => {
                        drawZones.find(dz => dz.zone == destId).setOptions({
                            fillColor: colorScaleOutbound(outbound[destId]),
                            strokeWeight: 2.0,
                            fillOpacity: 1
                        })
                    });
                    legendToMove = outboundLegend;
                }

                // Create the legend and display on the map
                const controlPosition = google.maps.ControlPosition.BOTTOM_CENTER;
                if (map.controls[controlPosition].length < 1) {
                    map.controls[controlPosition].push(legendToMove);
                } else {
                    map.controls[controlPosition].pop();
                    map.controls[controlPosition].push(legendToMove);
                }

                drawZone.setOptions({
                    fillColor: "green",
                    strokeWeight: 2.0,
                    fillOpacity: 0.3
                });
            };
            let clearPaths = () => {
                directionsDisplays.forEach((d) => {
                    d.setDirections({
                        routes: []
                    });
                });
            };
            let clearSelection = function () {
                for (let i = 0; i < drawZones.length; i++) {
                    drawZones[i].setOptions({
                        fillColor: getZoneColor(drawZones[i].zone),
                        strokeWeight: 1.5,
                        fillOpacity: 1
                    });
                }

                if (map.controls[google.maps.ControlPosition.BOTTOM_CENTER].length > 0) {
                    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].pop();
                }

                clearPaths();
                clickedZone = undefined;
            };
            let getZoneColor = (zoneId, dir = direction) => {
                if (!zoneTotalColors[zoneId]) zoneTotalColors[zoneId] = {};
                if (dir == 'inbound') {
                    if (!zoneTotalColors[zoneId].inbound) {
                        const count = data.data.filter(d => d.Destination_Zone_Num == zoneId).map(d => d.Count_Num);
                        const avg = count.reduce((a, b) => a + b, 0);
                        zoneTotalColors[zoneId].inbound = colorScaleInboundTotal(avg);
                    }
                    return zoneTotalColors[zoneId].inbound;
                } else {
                    if (!zoneTotalColors[zoneId].outbound) {
                        const count = data.data.filter(d => d.Origin_Zone_Num == zoneId).map(d => d.Count_Num);
                        const avg = count.reduce((a, b) => a + b, 0);
                        zoneTotalColors[zoneId].outbound = colorScaleOutboundTotal(avg);
                    }
                    return zoneTotalColors[zoneId].outbound;
                }
            };
            let calculateColors = () => {
                drawZones.forEach(dz => getZoneColor(dz.zone, 'inbound'));
                drawZones.forEach(dz => getZoneColor(dz.zone, 'outbound'));
            };
            let recolorZones = () => {
                let recycled;
                if (clickedZone) recycled = clickedZone;
                clearSelection();
                if (recycled) {
                    clickedZone = recycled;
                    selectZone(recycled.TAZ_ID);
                }
            };

            clearAll();

            d3.select('button#clear-btn').on('click', () => clearSelection());

            $('input#in-out-bound').change(function () {
                window.direction = this.checked ? 'outbound' : 'inbound';
                recolorZones();
            });

            /********************************************************************************************
             ** Read each JSON feature object.Get coordinate and convert it into object {lat: ,lng:}
             ********************************************************************************************/

            // Check if the coordinates array is separated in multiple arrays
            GEO_JSON.features.forEach(polygon => {
                let coordinates = polygon.geometry.coordinates;
                // If more than one array is present, concat all the children into one array
                if (coordinates.length != 1) polygon.geometry.coordinates = [].concat.apply([], coordinates);
            });
            var drawRoute = (value, subClickedZones) => {
                let selectable = false;
                if (direction == 'inbound') {
                    data.data.forEach(d => {
                        if (d.Destination_Zone == clickedZone.TAZ_ID && d.Origin_Zone == value.properties.TAZ_ID) {
                            selectable = true;
                        }
                    });
                } else {
                    data.data.forEach(d => {
                        if (d.Origin_Zone == clickedZone.TAZ_ID && d.Destination_Zone == value.properties.TAZ_ID) {
                            selectable = true;
                        }
                    });
                }
                if (selectable) {
                    if (subClickedZones) subClickedZones.push(value.properties);
                    calcRoute([{
                        sourceCenter: centers.find(c => c.TAZ_ID == value.properties.TAZ_ID).center,
                        destCenter: centers.find(c => c.TAZ_ID == clickedZone.TAZ_ID).center,
                        source: value.properties.TAZ_ID,
                        dest: clickedZone.TAZ_ID
                    }]);
                }
            };
            GEO_JSON.features.forEach(function (value) {
                //convert given coordinates array into
                let latlog = getLatlongMap(value.geometry.coordinates[0]);

                const zoneId = value.properties.TAZ_ID;
                let drawZone = new google.maps.Polygon({
                    paths: latlog,
                    strokeColor: "black",
                    strokeOpacity: 0.2,
                    strokeWeight: 1.5,
                    fillColor: getZoneColor(zoneId),
                    fillOpacity: 1
                });
                drawZone.setMap(map);
                drawZone.zone = zoneId;
                calculateColors();

                google.maps.event.addListener(drawZone, 'click', function () {
                    if (clickedZone && clickedZone == value.properties) {
                        clearSelection();
                    } else if (clickedZone) {
                        let clicked = subClickedZones.find(function (d) {
                            return d == value.properties
                        });
                        if (clicked) {
                            subClickedZones.splice(subClickedZones.indexOf(clicked, 1));
                            clearPaths();
                        } else {
                            subClickedZones = [];
                            drawRoute(value, subClickedZones);
                        }
                    } else {
                        clickedZone = value.properties;
                        //Clear previous paths
                        clearPaths();

                        selectZone(this.zone);
                    }

                });
                google.maps.event.addListener(drawZone, 'mouseover', function () {
                    moused = true;
                    if (clickedZone) drawRoute(value);
                });

                google.maps.event.addListener(drawZone, 'mouseout', function () {
                    if (moused) {
                        moused = false;
                        this.setOptions({ strokeOpacity: 0.2 });
                    }
                    directionsDisplays.forEach((d) => {
                        if (!subClickedZones[0] || d.source != subClickedZones[0].TAZ_ID) d.setDirections({
                            routes: []
                        });
                    });
                });

                drawZones.push(drawZone);
            });

            if (Object.keys(markers).length > 0) d3.select('#loader').classed('hidden', true);
        }
    };


    /********************************************************************************************
     **  Function converts coordinates array into {lang:,lat:} and return array of such object
     ********************************************************************************************/
    function getLatlongMap(coordinatesArray) {
        let latLongMap = [];
        for (let i in coordinatesArray) {
            if (coordinatesArray.hasOwnProperty(i))     
                latLongMap.push({
                    'lng': coordinatesArray[i][0],
                    'lat': coordinatesArray[i][1]
                })
        }
        return latLongMap;
    }


    function calcRoute(zoneRoutes) {
        if (zoneRoutes[0].dest != clickedZone.TAZ_ID) return;
        let route = routes[zoneRoutes[0].dest];
        let requestPaths = true;
        let stroke = {
            strokeColor: getRouteColor(),
            strokeOpacity: 0.9,
            zIndex: 10
        };
        if (route) {
            route.sources.forEach((d) => {
                if (d.sourceId == zoneRoutes[0].source) {
                    let directionsDisplay = new google.maps.DirectionsRenderer({
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
            let startPoint = zoneRoutes[0].sourceCenter;
            let endPoint = zoneRoutes[0].destCenter;
            let directionsDisplay = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                polylineOptions: stroke,
                preserveViewport: true,
                zIndex: 1000
            });
            directionsDisplay.setMap(map);

            let start = new google.maps.LatLng(startPoint.lat, startPoint.lng);
            let end = new google.maps.LatLng(endPoint.lat, endPoint.lng);

            let bounds = new google.maps.LatLngBounds();
            bounds.extend(start);
            bounds.extend(end);
            let request = {
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
                    routes[zoneRoutes[0].dest].sources.push({
                        sourceId: zoneRoutes[0].source,
                        path: response
                    });
                    if (zoneRoutes.length > 1) {
                        zoneRoutes.splice(0, 1);
                        setTimeout(function () {
                            calcRoute(zoneRoutes);
                        }, 300);
                    }
                } else {
                    if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                        setTimeout(function () {
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

})();