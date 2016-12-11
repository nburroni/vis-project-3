/* TODO Bugs
* Click on a zone, clear map, click on a top ten item, routes for the previously selected zone still show
*
* */

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
    let zoneColor = 0;
    let topCongestedList = {};
    let closeInfoWindow = false;
    let markers = {};

    let color_range = d3.scaleLinear().domain([0, 15000]).range(["rgba(253,187,132,.8)", "rgba(127,0,0,.8)"]);
    let color_range2 = d3.scaleLinear().domain([0, 15000]).range(["rgba(250,159,181,.8)", "rgba(73,0,106,.8)"]);
    let moused = false;

    let drawZones = [];

    const topTenBg = 'lightgrey';
    const topTenSelectedBg = 'rgba(255,0,0,.3)';

    let fillMarkers = () => {
        infowindow = new google.maps.InfoWindow();
        const places = ['catholic church', 'jewish temple', 'attraction'];
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
                    // createMarker(results[i]);
                    place = results[i];
                    let marker = new google.maps.Marker({
                        map: null,
                        position: place.geometry.location
                    });
                    let name = places[currentPlaceIndex];
                    if (!markers[name]) markers[name] = [];
                    markers[name].push(marker);
                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.setContent(place.name);
                        infowindow.open(map, this);
                    });
                }
            }
            if (pagination.hasNextPage) pagination.nextPage();
            else if (currentPlaceIndex + 1 < places.length) {
                currentPlaceIndex++;
                reqPlaces();
            }
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
            zoom: 9,
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

        $('input#in-out-bound').change(function () {
            window.direction = this.checked ? 'outbound' : 'inbound';
        });


        window.onDataReady = function (data, centers, GEO_JSON, holidays) {
            clickedZone = undefined;
            topCongestedList = data.topCongested;
            let max = Math.ceil(topCongestedList[0].Count_Num);
            let num1 = Math.ceil((max / 6));
            let num2 = Math.ceil((max / 6) * 2);
            let num3 = Math.ceil((max / 6) * 3);
            let num4 = Math.ceil((max / 6) * 4);
            let num5 = Math.ceil((max / 6) * 5);

            let infowindow = new google.maps.InfoWindow();
            let legend = document.createElement('div');
            legend.id = 'legend';
            let content = [];
            content.push('<h3>Inbound Trips</h3>');
            content.push('<p><div class="color color1"></div>0 - ' + num1 + '</p>');
            content.push('<p><div class="color color2"></div>' + num1 + ' - ' + num2 + '</p>');
            content.push('<p><div class="color color3"></div>' + num2 + ' - ' + num3 + '</p>');
            content.push('<p><div class="color color4"></div>' + num3 + ' - ' + num4 + '</p>');
            content.push('<p><div class="color color5"></div>' + num4 + ' - ' + num5 + '</p>');
            content.push('<p><div class="color color6"></div>' + num5 + ' - ' + max + '</p>');
            legend.innerHTML = content.join('');
            legend.index = 1;

            let legend2 = document.createElement('div');
            legend2.id = 'legend2';
            let content2 = [];
            content2.push('<h3>Outbound Trips</h3>');
            content2.push('<p><div class="color color7"></div>0 - ' + num1 + '</p>');
            content2.push('<p><div class="color color8"></div>' + num1 + ' - ' + num2 + '</p>');
            content2.push('<p><div class="color color9"></div>' + num2 + ' - ' + num3 + '</p>');
            content2.push('<p><div class="color color10"></div>' + num3 + ' - ' + num4 + '</p>');
            content2.push('<p><div class="color color11"></div>' + num4 + ' - ' + num5 + '</p>');
            content2.push('<p><div class="color color12"></div>' + num5 + ' - ' + max + '</p>');
            legend2.innerHTML = content2.join('');
            legend2.index = 1;


            directionsService = new google.maps.DirectionsService();

            for (let i = 0; i < drawZones.length; i++) {
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
            GEO_JSON.features.forEach(function (polygon) {
                let coordinates = polygon.geometry.coordinates;
                // If more than one array is present, concat all the children into one array
                if (coordinates.length != 1) {
                    polygon.geometry.coordinates = [].concat.apply([], coordinates);
                }
            });
            GEO_JSON.features.forEach(function (value, key) {
                //convert given coordinates array into
                let latlog = getLatlongMap(value.geometry.coordinates[0]);

                let drawZone = new google.maps.Polygon({
                    paths: latlog,
                    strokeColor: "black",
                    strokeOpacity: 0.2,
                    strokeWeight: 1.5,
                    fillColor: "green",
                    fillOpacity: 0.4
                });
                drawZone.setMap(map);
                drawZone.zone = value.properties.TAZ_ID;
                drawZone.setColorValue = 0;

                google.maps.event.addListener(drawZone, 'click', function (event) {

                    if (map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].length > 0) {
                        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].pop(legend4);
                    }

                    if (closeInfoWindow) {
                        infowindow.close();
                    }
                    if (clickedZone && clickedZone == value.properties) {
                        for (let i = 0; i < drawZones.length; i++) {
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
                        let clicked = subClickedZones.find(function (d) {
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
                            let selectable = false;
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

                        if (window.direction == 'inbound') {
                            clickedZone = value.properties;
                            for (let i = 0; i < drawZones.length; i++) {
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
                                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
                            }


                            let routeCount = 0;
                            //Clear previous paths
                            directionsDisplays.forEach((d) => {
                                d.setDirections({
                                    routes: []
                                });
                            });

                            directionsDisplays = [];
                            let zoneRoutes = [];
                            for (let i = 0; i < data.data.length; i++) {

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

                        } else {

                            clickedZone = value.properties;
                            for (let i = 0; i < drawZones.length; i++) {
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
                                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend2);
                            } else {
                                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend2);
                                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend2);
                            }


                            let routeCount = 0;
                            //Clear previous paths
                            directionsDisplays.forEach((d) => {
                                d.setDirections({
                                    routes: []
                                });
                            });

                            directionsDisplays = [];
                            let zoneRoutes = [];


                            for (let i = 0; i < data.data.length; i++) {
                                if (data.data[i].Origin_Zone == value.properties.OBJECTID_1) {
                                    if (data.data[i].Destination_Zone - 1 < 1267) {
                                        drawZones[data.data[i].Destination_Zone - 1].setColorValue += Number(data.data[i].Count);
                                        zoneColor = drawZones[data.data[i].Destination_Zone - 1].setColorValue;
                                        drawZones[data.data[i].Destination_Zone - 1].setOptions({
                                            fillColor: color_range2(drawZones[data.data[i].Destination_Zone - 1].setColorValue),
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
                    }


                    resetTopTenBg();
                    buttonAll.style.backgroundColor = topTenBg;

                });
                google.maps.event.addListener(drawZone, 'mouseover', function (event) {

                    moused = true;
                    if (clickedZone) {
                        let selectable = false;
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
                    }


                });

                google.maps.event.addListener(drawZone, 'mouseout', function (event) {

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

                google.maps.event.addListener(drawZone, 'dblclick', function (event) {
                    //Make all lighter
                    totalDest = 0;
                    totalOrigin = 0;

                    if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length > 0) {
                        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                    }

                    infowindow.close();
                    for (let i = 0; i < data.data.length; i++) {

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
                    for (let i = 0; i < drawZones.length; i++) {

                        drawZones[i].setOptions({
                            strokeColor: "black",
                            strokeOpacity: 0.2,
                            strokeWeight: 1.5,
                            fillColor: "green",
                            fillOpacity: 0.4
                        });
                    }
                    map.fitBounds(drawZone.getBounds());
                    map.setZoom(map.getZoom() - 1);
                    if (map.getZoom() > 14) {
                        map.setZoom(14);
                    }
                    map.setCenter(drawZone.getBounds().getCenter());


                });

                google.maps.event.addListener(map, 'zoom_changed', function (event) {
                    //infowindow.close(map);

                });

                drawZones.push(drawZone);
            });

            let legend3 = document.createElement('div');
            legend3.id = 'legend3';

            let content3 = [];
            content3.push('<h4>Top Ten Congested Trips</h4>');

            legend3.innerHTML = content3.join('');
            legend3.index = 1;

            let centerControl = new CenterControl(legend3, map);

            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(legend3);


        }
    }


    /********************************************************************************************
     **  Function converts coordinates array into {lang:,lat:} and return array of such object
     ********************************************************************************************/
    function getLatlongMap(coordinatesArray) {
        let latLongMap = [];
        for (let i in coordinatesArray) {
            latLongMap.push({
                'lng': coordinatesArray[i][0],
                'lat': coordinatesArray[i][1]
            })
        }
        return latLongMap;
    }

    function createButton(controlDiv, num) {
        let displayNum = num + 1;
        // Set CSS for the control border.
        let controlUI = document.createElement('div');
        controlUI.id = "button" + num;
        controlUI.style.backgroundColor = topTenBg;
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
        let controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '14px';
        controlText.style.lineHeight = '16px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = displayNum + ': From Zone ' + topCongestedList[num].Origin_Zone_Num + ' to Zone ' + topCongestedList[num].Destination_Zone_Num;
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function () {

            if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length > 0) {
                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
            }

            for (let i = 0; i < drawZones.length; i++) {


                if (drawZones[i].zone == topCongestedList[num].Origin_Zone_Num || drawZones[i].zone == topCongestedList[num].Destination_Zone_Num) {

                    drawZones[i].setOptions({
                        fillColor: topTenSelectedBg,
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
                }

            }

            resetTopTenBg();
            buttonAll.style.backgroundColor = topTenBg;
            controlUI.style.backgroundColor = topTenSelectedBg;

            let legend4 = document.createElement('div');
            legend4.id = 'legend4';
            legend4.innerHTML = `
                <h3>Congestion Info</h3>
                <p>Origination Zone: ${topCongestedList[num].Origin_Zone_Num}</p>
                <p>Originating County: ${topCongestedList[num].Origin_County}</p>
                <p>Destination Zone: ${topCongestedList[num].Destination_Zone_Num}</p>
                <p>Destination County: ${topCongestedList[num].Destination_County}</p>
                <p>Purpose of trips: ${topCongestedList[num].Purpose}</p>
                <p>Total Trips: ${Math.ceil(topCongestedList[num].Count_Num)}</p>
                <p>Trip Time: from ${topCongestedList[num].Time_Range_Str.from} to ${topCongestedList[num].Time_Range_Str.to}</p>`;
            legend4.index = 1;


            // Create the legend and display on the map
            if (map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].length < 1) {
                map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legend4);
            } else {
                map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].pop(legend4);
                map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legend4);
            }


        });
    }

    function CenterControl(controlDiv, map) {

        for (let i = 0; i < 10; i++)
            createButton(controlDiv, i);

        // Set CSS for the control border.
        let controlUI = document.createElement('div');
        controlUI.id = "buttonAll";
        controlUI.style.backgroundColor = topTenBg;
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
        let controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '14px';
        controlText.style.lineHeight = '28px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Show All';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function () {

            if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length > 0) {
                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
            }


            for (let i = 0; i < drawZones.length; i++) {
                let zone = drawZones[i].zone;
                if (topCongestedList.filter(d => d.Origin_Zone_Num == zone || d.Destination_Zone_Num == zone).length > 0)
                    drawZones[i].setOptions({
                        fillColor: topTenSelectedBg,
                        strokeWeight: 4,
                        strokeColor: 'black',
                        fillOpacity: 1,
                    });
                else
                    drawZones[i].setOptions({
                        fillColor: "rgba(0,0,0,.03)",
                        strokeWeight: 0,
                        fillOpacity: 1,
                        zIndex: 0
                    });
            }

            resetTopTenBg();
            controlUI.style.backgroundColor = topTenSelectedBg;


            let legend4 = document.createElement('div');
            legend4.id = 'legend4';
            legend4.innerHTML = `
                <h3>Congestion Info</h3>
                <p>Most Congested Origination Zone: ${topCongestedList[0].Origin_Zone_Num}</p>
                <p>Most Congested Destination Zone: ${topCongestedList[0].Destination_Zone_Num}</p>
                <p>Most Congested Total Trips: ${Math.ceil(topCongestedList[0].Count_Num)}</p>
                <p>Trip Time: from ${topCongestedList[0].Time_Range_Str.from} to ${topCongestedList[0].Time_Range_Str.to}</p>
                <p> </p>
                <p>Tenth Most Congested Origination Zone: ${topCongestedList[9].Origin_Zone_Num}</p>
                <p>Tenth Most Congested Destination Zone: ${topCongestedList[9].Destination_Zone_Num}</p>
                <p>Tenth Most Congested Total Trips: ${Math.ceil(topCongestedList[9].Count_Num)}</p>
                <p>Trip Time: from ${topCongestedList[9].Time_Range_Str.from} to ${topCongestedList[9].Time_Range_Str.to}</p>`;

            legend4.index = 1;

            // Create the legend and display on the map
            const control = map.controls[google.maps.ControlPosition.BOTTOM_RIGHT];
            if (control.length >= 1) {
                control.pop(legend4);
            }
            control.push(legend4);
        });

        // Set CSS for the control border.
        let controlUI2 = document.createElement('div');
        controlUI2.id = "cleapMap";
        controlUI2.style.backgroundColor = topTenBg;
        controlUI2.style.border = '3px solid black';
        controlUI2.style.borderRadius = '3px';
        controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI2.style.cursor = 'pointer';
        controlUI2.style.marginBottom = '10px';
        controlUI2.style.textAlign = 'center';
        controlUI2.style.width = '230px';
        controlUI2.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI2);

        // Set CSS for the control interior.
        let controlText2 = document.createElement('div');
        controlText2.style.color = 'rgb(25,25,25)';
        controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText2.style.fontSize = '14px';
        controlText2.style.lineHeight = '28px';
        controlText2.style.paddingLeft = '5px';
        controlText2.style.paddingRight = '5px';
        controlText2.innerHTML = 'clear map';
        controlUI2.appendChild(controlText2);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI2.addEventListener('click', function () {
            if (window.direction == 'inbound') {
                if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length > 0) {
                    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                }
            } else {
                if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length > 0) {
                    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend2);
                }
            }

            if (map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].length > 0) {
                map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].pop(legend4);
            }

            for (let i = 0; i < drawZones.length; i++) {
                drawZones[i].setOptions({
                    strokeColor: "black",
                    strokeOpacity: 0.2,
                    strokeWeight: 1.5,
                    fillColor: "green",
                    fillOpacity: 0.4
                });
            }

            resetTopTenBg();
            buttonAll.style.backgroundColor = topTenBg;
            controlUI2.style.backgroundColor = topTenBg;

        });

    }

    function calcRoute(zoneRoutes) {
        if (zoneRoutes[0].dest != clickedZone.OBJECTID_1) return;
        let route = routes[zoneRoutes[0].dest];
        let requestPaths = true;
        let stroke = {
            strokeColor: "#8539ff",
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

    function resetTopTenBg() {
        for (let i = 0; i < 10; i++)
            document.getElementById(`button${i}`).style.backgroundColor = topTenBg;
    }

})();