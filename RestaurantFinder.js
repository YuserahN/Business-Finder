/*Created By: Yuserah Din
    Date: 04/22/2019
*/

var map; 
var infoWindow;
var request;
var service;
var markers = [];
var address;
var radiusInput;
var autocomplete;
var latitude;
var longitude;
var center;
var miles;
var zoomvar;

function initialize() {
    var input = document.getElementById('searchBox');
    autocomplete = new google.maps.places.Autocomplete(input);	
	
	google.maps.event.addListener(autocomplete, 'place_changed', function () {		
		var place = autocomplete.getPlace();
		latitude = place.geometry.location.lat();
		longitude = place.geometry.location.lng();
		center = {lat: latitude, lng: longitude}
		map.setCenter(center)
		clearResults(markers)
		
		showCurrentLocation();
	});
		
	center = {lat: 41.8333925, lng: -88.0121486};
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 13
    });
	
    //Optional Code (Clear and Center)
    google.maps.event.addListener(map, 'rightclick', function(event) {
        map.setCenter(event.latLng)
        clearResults(markers)

        var request = {
            location: event.latLng, 
            radius: radiusInput,
            types: ['restaurant']
        };
        service.nearbySearch(request, callback);
    });
}

//Start search after address and radius filled
function startSearch() {
    radiusInput = document.getElementById('searchBox2').value;

    //Change zoom level based on radius
    if (radiusInput == 5) {
        zoomvar = 12;
    } else if (radiusInput == 10 || radiusInput == 15) {
        zoomvar = 11;
    } else {
        zoomvar = 10;
    }

	//Convert miles to meters
	radiusInput = radiusInput / 0.00062137;

	//center = {lat: 41.8333925, lng: -88.0121486};
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: zoomvar
    });
	
	showCurrentLocation();
	
    request = {
        location: center,
        radius: radiusInput,
        types: ['restaurant']
    };

	infoWindow = new google.maps.InfoWindow();
	
	service = new google.maps.places.PlacesService(map);
	
    service.nearbySearch(request, callback);
}

//Put a marker that shows current location
function showCurrentLocation() {
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
}

function callback(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
                markers.push(createMarker(results[i]));
        }
    }
}

function createMarker(place) {
	
    //Request Place Details, placeId Required
    var request = {
        placeId: place.place_id,
        fields: ['name', 'formatted_address', 'place_id'],
    };

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

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