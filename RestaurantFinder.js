/*Created By: Yuserah Din
    Date: 04/22/2019
*/

var map; 
var infoWindow;
//var geocoder;
var request;
var service;
var markers = [];
var address;

function initialize() {
    var input = document.getElementById('searchBox');
    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        var latitude = place.geometry.location.lat();
        var longitude = place.geometry.location.lng();
        var center = {lat: latitude, lng: longitude}
        map.setCenter(center)
        clearResults(markers)

        //Set Current Location Marker
		var myLatLng = {lat: latitude, lng: longitude};	
		var myMarker = new google.maps.Marker({
          position: myLatLng,
          map: map,
        });

        //Show CurrLocMarker Details When Pressed
        google.maps.event.addListener(myMarker, 'click', function () {
            infoWindow.setContent('<div><strong>' + "Current Location" + '</strong><br>');
            infoWindow.open(map, this);
        });

        var request = {
            location: center, 
            radius: 8047,
            types: ['restaurant']
        };

        service.nearbySearch(request, callback);
    });
	
    var center = {lat: 41.8333925, lng: -88.0121486};
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 13
    });

    request = {
        location: center,
        radius: 8047,
        types: ['restaurant']
    };
    
    //geocoder = new google.maps.Geocoder;

    infoWindow = new google.maps.InfoWindow();

    service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, callback);

    //Optional Code (Clear and Center)
    google.maps.event.addListener(map, 'rightclick', function(event) {
        map.setCenter(event.latLng)
        clearResults(markers)

        var request = {
            location: event.latLng, 
            radius: 8047,
            types: ['restaurant']
        };
        service.nearbySearch(request, callback);
    });
}

function callback(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
                markers.push(createMarker(results[i]));
        }
    }
}

function createMarker(place) {

    //var latlng = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };

    //Request Place Details, placeId Required
    var request = {
        placeId: place.place_id,
        fields: ['name', 'formatted_address', 'place_id'],
    };

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    //geocoder.geocode({ 'location': latlng }, function (results, status) {
    //    if (status === 'OK') {
    //        if (results[0]) {
    //            address = results[0].formatted_address
    //        }
    //    } else {
    //        address = "Geocoder failed: " + status
    //    }
    //});

    //Show Store Name and Address When Pressed
    google.maps.event.addListener(marker, 'click', function () {
        getAddress();
        setTimeout(function () { getAddress(); }, 300);
        setTimeout(function () { showDetails(marker); }, 301);
            
    });

    function getAddress() {
        service.getDetails(request, function (place, status) {
            address = place.formatted_address;
        });  
    }

    function showDetails(marker) {
        infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            address + '</div>');
        infoWindow.open(map, marker);
    }

    return marker;
}

function clearResults(markers) {
    for (var m in markers) {
        markers[m].setMap(null)
    }
    markers = []
}
google.maps.event.addDomListener(window, 'load', initialize);