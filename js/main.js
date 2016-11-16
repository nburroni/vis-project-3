var map;

function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 28.3317, lng: -81.3246},
		zoom: 10
		});
		if (!google.maps.Polygon.prototype.getBounds) {
 
		google.maps.Polygon.prototype.getBounds=function(){
			var bounds = new google.maps.LatLngBounds()
			this.getPath().forEach(function(element,index){bounds.extend(element)})
			return bounds
		}
	}
  var drawZones = [];
  /********************************************************************************************
  ** Read each JSON feature object.Get coordinate and convert it into object {lat: ,lng:}
  ********************************************************************************************/
  d3.json("./data/json/zones-geo.json", function (err, GEO_JSON) {
      d3.json("./data/json/zone-centers.json", function (err, centers){
          // Check if the coordinates array is separated in multiple arrays
          GEO_JSON.features.forEach(function (polygon){
              var coordinates = polygon.geometry.coordinates;
              // If more than one array is present, concat all the children into one array
              if (coordinates.length != 1){
                  polygon.geometry.coordinates = [].concat.apply([], coordinates);
              }
          });
          GEO_JSON.features.forEach(function(value,key){
              //convert given coordinates array into
              var latlog = getLatlongMap(value.geometry.coordinates[0]);
              //console.log(value);

              var drawZone = new google.maps.Polygon({
                  paths:latlog ,
                  strokeColor: "black",
                  strokeOpacity: 0.2,
                  strokeWeight: 1.5,
                  fillColor: "green",
                  fillOpacity: 0.1
              });
              drawZone.setMap(map);
			  
			  google.maps.event.addListener(drawZone, 'click', function (event) {
			//Make all lighter
			//console.log("The zone clicked on is: " + drawZone);

			for(var index=0;index<drawZones.length;index++){
				drawZones[index].setOptions({strokeWeight: 2.0,fillOpacity: 0.2})
			}

			//Make selected darker
			drawZone.setOptions({strokeWeight: 1.0,fillOpacity: 0.8});
			
			//Get bound for polygon// calculate the bounds of the polygon
			var bounds = new google.maps.LatLngBounds();
			
			
		});  
		
		google.maps.event.addListener(drawZone, 'dblclick', function (event) {
			//Make all lighter
			//console.log("The zone clicked on is: " + drawZone);

	
         	map.setCenter(drawZone.getBounds().getCenter());
			map.setZoom(11); 	
			
		});  

              drawZones.push(drawZone);
          });

          // Draw red circles in center of each polygon
          centers.forEach(function (d){
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

/********************************************************************************************
 **  Function converts coordinates array into {lang:,lat:} and return array of such object
 ********************************************************************************************/
function getLatlongMap(coordinatesArray) {
	var latLongMap = [];
	for(var i in coordinatesArray){
		latLongMap.push({
			'lng':coordinatesArray[i][0],
			'lat':coordinatesArray[i][1]
		})
	}
	return latLongMap;
}