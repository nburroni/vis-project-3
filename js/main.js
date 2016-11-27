var map;
var startTime;
var purpose;
var date;
var zoneColor = 0;
startTime = 10;
var color_range=d3.scaleLinear().domain([0,800]).range(["white","blue"]);






function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 28.3317,
            lng: -81.3246
        },
        zoom: 10
    });
    if (!google.maps.Polygon.prototype.getBounds) {
        google.maps.Polygon.prototype.getBounds = function() {
            var bounds = new google.maps.LatLngBounds()
            this.getPath().forEach(function(element, index) {
                bounds.extend(element)
            })
            return bounds
        }
    }
	
	
	window.onDataReady = function(data, zones) {

    //zonesData = data;
    //console.log(data);
	
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

                google.maps.event.addListener(drawZone, 'click', function(event) {

                    console.log("The zone clicked on is: " + value.properties.OBJECTID_1);
                    //console.log(value.properties);
                    //console.log(data.data[0].Destination_Zone);
					//console.log(drawZones.length);
					for(var i=0; i<drawZones.length; i++){
						
						drawZones[i].setOptions({fillColor: "black",strokeWeight: 1.5,fillOpacity: 1});
						drawZones[i].setColorValue = 0;
					}
					
                    for(var i=0; i<data.data.length; i++){
						//console.log(data.data[i].Origin_Zone);
                                    if( data.data[i].Destination_Zone == value.properties.OBJECTID_1){
										//console.log(data.data[i].Destination_Zone);
										//zoneColor++;
										//console.log(value.properties.OBJECTID_1);
										//console.log(drawZones[data.data[i].Origin_Zone - 1]);
										
										
										if ( data.data[i].Origin_Zone - 1 < 1267 ){
											
											
										drawZones[data.data[i].Origin_Zone - 1].setColorValue += Number(data.data[i].Count);
										//console.log(data.data[i].Count);
										//console.log(drawZones[data.data[i].Origin_Zone - 1].setColorValue);
										zoneColor = drawZones[data.data[i].Origin_Zone - 1].setColorValue;
										//console.log(zoneColor);
										//console.log(drawZones[data.data[i].Origin_Zone - 1].setColorValue);
										//console.log(color_range(drawZones[data.data[i].Origin_Zone - 1].setColorValue));
										drawZones[data.data[i].Origin_Zone - 1].setOptions({fillColor: color_range(drawZones[data.data[i].Origin_Zone - 1].setColorValue),strokeWeight: 2.0,fillOpacity: 1})
										//drawZones[data.data[i].Origin_Zone - 1].setOptions({fillColor: "blue",strokeWeight: 2.0,fillOpacity: 0.4})
										//drawZones[data.data[i].Origin_Zone - 1].setFillColor("zoneColor,0,0)");
										
										
										}
									}

                    }

                    //Make selected darker
                    drawZone.setOptions({
						fillColor: "green",
                        strokeWeight: 2.0,
                        fillOpacity: 1.0
                    });

                    //Get bound for polygon// calculate the bounds of the polygon
                    //var bounds = new google.maps.LatLngBounds();


                });

                google.maps.event.addListener(drawZone, 'dblclick', function(event) {
                    //Make all lighter
                    //console.log("The zone clicked on is: " + drawZone);
					
					/*for(var i=0; i<data.data.length; i++){
						//console.log(data.data[i].Origin_Zone);
                                    if( data.data[i].Origin_Zone == value.properties.OBJECTID_1){
										var infowindow = new google.maps.InfoWindow({
										content: contentString
										});
										}
									}

                    }*/
					
					console.log(value.properties);
					var contentString = "<p>Zone: " + value.properties.OBJECTID_1 + ".</p><p>County: " + value.properties.COUNTY + ".</p>";
					var infowindow = new google.maps.InfoWindow({
					content: contentString
					});
					infowindow.setPosition(drawZone.getBounds().getCenter());
					infowindow.open(map);
					for(var i=0; i<drawZones.length; i++){
						
						drawZones[i].setOptions({strokeColor: "black",
												strokeOpacity: 0.2,
												strokeWeight: 1.5,
												fillColor: "green",
												fillOpacity: 0.4});
					}

                    
					//console.log("The zone clicked on is: " + value.properties.OBJECTID_1);
					//console.log("The Bounds are: " + drawZone.getBounds());
                    
					//map.panToBounds(drawZone.getBounds());
					map.fitBounds(drawZone.getBounds());
					console.log("The zoom level is: " + map.getZoom());
					map.setZoom(map.getZoom() - 1);
					console.log("The next zoom level is: " + map.getZoom());
					if (map.getZoom() > 14){
						map.setZoom(14);
						console.log("The new zoom level is: " + map.getZoom());
					}
					map.setCenter(drawZone.getBounds().getCenter());
					
					
					

                });

                drawZones.push(drawZone);
            });

            // Draw red circles in center of each polygon
            centers.forEach(function(d) {
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
            });
        })
    })
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