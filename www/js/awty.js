/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

/** Converts radians to numeric (signed) degrees */
if (typeof(Number.prototype.toDeg) === "undefined") {
  Number.prototype.toDeg = function() {
    return this * 180 / Math.PI;
  }
}

// i hate this
var itemGobalLat;
var itemGlobalLong;
var nameGlobal;
// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
var onGeoSuccess = function(position) {
    //alert('Latitude: '          + position.coords.latitude          + '\n' +
    //      'Longitude: '         + position.coords.longitude         + '\n' +
    //      'Altitude: '          + position.coords.altitude          + '\n' +
    //      'Accuracy: '          + position.coords.accuracy          + '\n' +
    //      'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //      'Heading: '           + position.coords.heading           + '\n' +
    //      'Speed: '             + position.coords.speed             + '\n' +
    //      'Timestamp: '         + new Date(position.timestamp)      + '\n');
    //alert("calling havesine");
    haversine(nameGlobal,position.coords.latitude,position.coords.longitude,itemGlobalLat, itemGlobalLong);
};

// onError Callback receives a PositionError object
//
function onGeoError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function geo(name,itemLat,itemLong)
{
	itemGlobalLat = itemLat;
	itemGlobalLong = itemLong;
	nameGlobal = name;
	navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
}


function haversine(name,lat1,lon1,lat2,lon2)
{
	
	var R = 6371; // km	
	var dLat = (lat2-lat1).toRad();	
	var dLon = (lon2-lon1).toRad();
	var lat1 = lat1.toRad();
	var lat2 = lat2.toRad();
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	if( d <= 1)
	{
		alert("You Found It!");
		//update the file to say what you found
		window.localStorage.setItem(name,"true");
	}
	else
		alert("You are not close enough! You need to be 1 km or less away from your item."  + d + "km");
	
	//TODO ask ted about this
	history.go(-1);
	return true;
}

function checkProof( name )
{
	var data = window.localStorage.getItem(name);		
	if( data == null)
	{
		window.localStorage.setItem(name,"false");
		//make sure that we set the proof to false;
	}
	else
	{
		if( data == "true")
		{			
			// set the found icon
		}
	}
}