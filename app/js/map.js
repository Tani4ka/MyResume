var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(29.017224, -82.473262),
        zoom: 17,
        mapTypeControl: false,
        zoomControl: false,         // + -
        scaleControl: false,
        fullscreenControl: false,
        streetViewControl: false,  // yellow men
        scrollwheel: false,        // overlay


        styles: [{"featureType": "all", "elementType": "labels.text.fill", "stylers": [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]},
            {"featureType": "all", "elementType": "labels.text.stroke", "stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]},
            {"featureType": "all", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
            {"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"lightness": 17}, {"weight": 1.2}, {"color": "#e5e5e5"}]},
            {"featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{"color": "#e5e5e5"}]},
            {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"}, {"lightness": 17}]},
            {"featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{"color": "#2b2b2b"}]}]
    });
    var center = map.getCenter();
    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(center);
    });
}