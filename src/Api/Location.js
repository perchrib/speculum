const utmObj = require('utm-latlng');
const utm=new utmObj();

const getPosition = async() => {
    var responseObj = {data: {}, success: false, errorMessage: "", error: ""};
    if ("geolocation" in navigator) {
        responseObj = await loadPosition(responseObj);
      }
    else{
        responseObj.errorMessage = "Geolocation in javascript not work.";
    }
    return responseObj;
  }

  //https://steemit.com/programming/@leighhalliday/converting-geolocation-from-callbacks-into-async-await-javascript
const loadPosition = async (responseObj) => {
    try {
        
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        // var latitude = 59.911491;
        // var longitude = 10.757933;
        var {Easting, Northing}= utm.convertLatLngToUtm(latitude, longitude, 7);
        // convert to string to avoid decimals and convert back to int (UTM format no need decimals)
        var eastStr = parseInt(Easting.toString().split('.')[0], 10);
        var northStr = parseInt(Northing.toString().split('.')[0], 10);

        var latStr = parseInt(latitude.toFixed(7), 10);
        var longStr = parseInt(longitude.toFixed(7), 10);
        responseObj.data = {latitude:latStr, longitude: longStr, utmEast: eastStr, utmNorth: northStr};
        responseObj.success = true;
    
    } catch (error) {
        responseObj.error = error;
        responseObj.errorMessage = "Can't find youre position.";
    }
    finally{
        return responseObj;
    }
};

function getCurrentPosition(options = {}){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
};

export default getPosition;