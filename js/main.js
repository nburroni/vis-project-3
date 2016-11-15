var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 28.4717, lng: -81.3246},
        zoom: 11
    });
}