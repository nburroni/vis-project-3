var map;

function initMap() {
<<<<<<< HEAD
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
  GEO_JSON.features.forEach(function(value,key){
	  //covert given coordinates array into 
	  var latlog = getLatlongMap(value.geometry.coordinates[0]);
	  //console.log(value);
	  
	 var  drawZone = new google.maps.Polygon({
		    paths:latlog ,
		    strokeColor: "black",
		    strokeOpacity: 0.2,
		    strokeWeight: 1.5,
		    fillColor: "green",
		    fillOpacity: 0.1
		  });
		  drawZone.setMap(map);	

		drawZones.push(drawZone);
  });
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

=======
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 28.4717, lng: -81.3246},
        zoom: 11
    });
}
>>>>>>> origin/master
