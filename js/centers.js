
// Function for calculating the centers of each zone
function calculateCenters (){
    d3.json("../data/json/zones-geo.json", function (err, data){
        if (err) return console.warn(err);
        var centerJson = [];
        data.features.forEach(function (polygon){
            var coordinates = polygon.geometry.coordinates;
            var xMin;
            var xMax;
            var yMin;
            var yMax;
            if (coordinates.length != 1){
                coordinates = [].concat.apply([], coordinates);
            }
            coordinates[0].forEach(function (coordinate){
                if (!xMin || xMin > coordinate[0]) xMin = coordinate[0];
                if (!xMax || xMax < coordinate[0]) xMax = coordinate[0];
                if (!yMin || yMin > coordinate[1]) yMin = coordinate[1];
                if (!yMax || yMax < coordinate[1]) yMax = coordinate[1];
            });
            var center = {lng: xMin + ((xMax - xMin) / 2), lat: yMin + ((yMax - yMin) / 2) };
            centerJson.push ({center: center, TAZ_ID: polygon.properties.TAZ_ID});

        });
        console.log (JSON.stringify(centerJson));
    });
}
