(function () {
    let map;
    let directionsService;
    let directionsDisplays = [];
    let routes = [];
    let clickedZone;
    let subClickedZones = [];
    let startTime;
    let purpose;
    let date;
    let totalDest;
    let totalOrigin;
    let zoneColor = 0;
    startTime = 10;
//let color_range = d3.scaleLinear().domain([0, 20000]).range(["rgba(253,212,158,.8)", "rgba(179,0,0,.8)"]);
    let topCongestedList = {};
    let closeInfoWindow = false;

    let color_range = d3.scaleLinear().domain([0, 15000]).range(["rgba(253,187,132,.8)", "rgba(127,0,0,.8)"]);
    let color_range2 = d3.scaleLinear().domain([0, 15000]).range(["rgba(250,159,181,.8)", "rgba(73,0,106,.8)"]);
    let clicked = false;
    let moused = false;
    let destination = false;

    let drawZones = [];

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

        $('input#dark-mode').change(function () {
            map.mapTypes.set('styled_map', new google.maps.StyledMapType(this.checked ? darkMapJson : silverMapJson));
        });

        $('input#in-out-bound').change(function () {
            window.direction = this.checked ? 'outbound' : 'inbound';
        });


        window.onDataReady = function (data, centers, GEO_JSON) {
            clickedZone = undefined;
            topCongestedList = data.topCongested;
            let max = Math.ceil(topCongestedList[0].Count_Num);
            //console.log(topCongestedList);
            //console.log(max);
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
                //console.log(value);

                let drawZone = new google.maps.Polygon({
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
                            console.log("The zone clicked on is: " + value.properties.TAZ_ID);
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
                                console.log("test");
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
                            console.log("The zone clicked on is: " + value.properties.TAZ_ID);
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
                                console.log("test");
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
                    //console.log("The zone clicked on is: " + drawZone);
                    totalDest = 0;
                    totalOrigin = 0;

                    if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length > 0) {
                        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
                    }

                    //console.log(value.properties);
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
                    console.log("The zoom level is: " + map.getZoom());
                    map.setZoom(map.getZoom() - 1);
                    console.log("The next zoom level is: " + map.getZoom());
                    if (map.getZoom() > 14) {
                        map.setZoom(14);
                        console.log("The new zoom level is: " + map.getZoom());
                    }
                    map.setCenter(drawZone.getBounds().getCenter());


                });

                google.maps.event.addListener(map, 'zoom_changed', function (event) {
                    //infowindow.close(map);

                });

                drawZones.push(drawZone);
            });

            /*let legend4 = document.createElement('div');
             legend4.id = 'legend4';
             let content4 = [];
             content4.push('<h3>Congestion Info</h3>');
             content4.push('<p>test</p>');
             legend4.innerHTML = content4.join('');
             legend4.index = 1;*/

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
            //controlUI.style.backgroundColor = 'red';
            console.log("legend " + num + " Clicked");

            if (map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].length > 0) {
                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
            }

            for (let i = 0; i < drawZones.length; i++) {


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

            //console.log(topCongestedList);
            let legend4 = document.createElement('div');
            legend4.id = 'legend4';
            let content4 = [];
            content4.push('<h3>Congestion Info</h3>');
            content4.push("<p>Origination Zone: " + topCongestedList[num].Origin_Zone_Num + ".</p>");
            content4.push("<p>Originating County: " + topCongestedList[num].Origin_County + ".</p>");
            content4.push("<p>Destination Zone: " + topCongestedList[num].Destination_Zone_Num + ".</p>");
            content4.push("<p>Destination County: " + topCongestedList[num].Destination_County + ".</p>");
            content4.push("<p>Purpose of trips: " + topCongestedList[num].Purpose + ".</p>");
            content4.push("<p>Total Trips: " + Math.ceil(topCongestedList[num].Count_Num) + ".</p>");
            content4.push("<p>Trip Time: from " + topCongestedList[num].Time_Range_Str.from + " to " + topCongestedList[num].Time_Range_Str.to + ".</p>");
            legend4.innerHTML = content4.join('');
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
        let controlUI = document.createElement('div');
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


            let legend4 = document.createElement('div');
            legend4.id = 'legend4';
            let content4 = [];
            content4.push('<h3>Congestion Info</h3>');
            content4.push("<p>Most Congested Origination Zone: " + topCongestedList[0].Origin_Zone_Num + ".</p>");
            content4.push("<p>Most Congested Destination Zone: " + topCongestedList[0].Destination_Zone_Num + ".</p>");
            content4.push("<p>Most Congested Total Trips: " + Math.ceil(topCongestedList[0].Count_Num) + ".</p>");
            content4.push("<p>Trip Time: from " + topCongestedList[0].Time_Range_Str.from + " to " + topCongestedList[0].Time_Range_Str.to + ".</p>");
            content4.push("<p> </p>");
            content4.push("<p>Tenth Most Congested Origination Zone: " + topCongestedList[9].Origin_Zone_Num + ".</p>");
            content4.push("<p>Tenth Most Congested Destination Zone: " + topCongestedList[9].Destination_Zone_Num + ".</p>");
            content4.push("<p>Tenth Most Congested Total Trips: " + Math.ceil(topCongestedList[9].Count_Num) + ".</p>");
            content4.push("<p>Trip Time: from " + topCongestedList[9].Time_Range_Str.from + " to " + topCongestedList[9].Time_Range_Str.to + ".</p>");
            legend4.innerHTML = content4.join('');
            legend4.index = 1;

            // Create the legend and display on the map
            if (map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].length < 1) {
                map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legend4);
            } else {
                map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].pop(legend4);
                map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legend4);
            }
        });

        // Set CSS for the control border.
        let controlUI2 = document.createElement('div');
        controlUI2.id = "cleapMap";
        controlUI2.style.backgroundColor = 'lightgrey';
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
            controlUI2.style.backgroundColor = 'lightgrey';
            console.log("legend clear map Clicked");

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
                        console.log("limit reached");
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