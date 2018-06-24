//Get Stations
const TransportationType = {
    0: "Walking",
    1: "AirportBus",
    2: "Bus",
    3: "Dummy",
    4: "AirportTrain",
    5: "Boat",
    6: "Train",
    7: "Tram",
    8: "Metro"
}


function ResponseObj (){
    this.data = {};
    this.success = false;
    this.errorMessage = "";
    this.error = "";
    this.setSuccess = function (data){
        this.success = true;
        this.data = data
    }
    this.setError = function (errorMessage, error){
        this.errorMessage = errorMessage;
        this.error = error;
    }
}

function getRadiusOfPosition(utmEast, utmNorth, radius){
    const xmax = utmEast + radius;
    const xmin = utmEast - radius;
    const ymin = utmNorth - radius;
    const ymax = utmNorth + radius;
    return {xmin, xmax, ymin, ymax};
}

// get stops
const getStops = (utmEast, utmNorth) => {
    var responseObj = new ResponseObj();
    
    const {xmin, xmax, ymin, ymax} = getRadiusOfPosition(utmEast, utmNorth, 500);
    var url = `http://reisapi.ruter.no/Place/GetStopsByArea?xmin=${xmin}&xmax=${xmax}&ymin=${ymin}&ymax=${ymax}`;
    var stops = [];
    return fetch(url)
    .then(result => result.json())
    .then((data) => {
        data.forEach(element => {
            let distance = getManhattenDistance(element.X, element.Y, utmEast, utmNorth);
            stops.push({name: element.Name, xpos: element.X, ypos: element.Y, id: element.ID, distance: distance});
        });
        stops.sort(function(a, b) {
            return parseFloat(a.distance) - parseFloat(b.distance);
        });
        responseObj.setSuccess(stops);
        return responseObj;
    })
    .catch((error) => {
        responseObj.setError("Could not load data.", error);
        return responseObj;
    });
}

const getManhattenDistance = (x, y, _x, _y) => {
    return Math.abs(x - _x) + Math.abs(y - _y);
}

//Get all information in a stop
const getStopInformation = async (stationId, callback) => {
    const url = `http://reisapi.ruter.no/StopVisit/GetDepartures/${stationId}`;
    let transports = new Map();
    var platforms = new Map();

    await fetch(url)
    .then(result => result.json())
    .then((data) => {
        data.forEach((element) => {
            let lineId = element.MonitoredVehicleJourney.LineRef;
            let destinationName = element.MonitoredVehicleJourney.DestinationName;
            let destinationRef = element.MonitoredVehicleJourney.DestinationRef;
            let platform = element.MonitoredVehicleJourney.MonitoredCall.DeparturePlatformName;
            
            let aimedArrivalTime = element.MonitoredVehicleJourney.MonitoredCall.AimedArrivalTime;
            let expectedArrivalTime = element.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime;
            
            //Bug in ruterAPI same destinationref for some lines...
            destinationRef = destinationRef + lineId;
            var transport;
            if(transports.has(destinationRef)){
                transport = transports.get(destinationRef);
            }
            else{
                transport = new Transportation(destinationRef, lineId, destinationName, platform);
                transports.set(destinationRef, transport);
                //transport.transportationType = getTransportationType(lineId).then(data => console.log(data));
                // getTransportationType(lineId).then((data) => {
                //     console.log(data);
                // })
                //debugger;
            }
            transport.arrivalTime.push(new Date(aimedArrivalTime));
            var dateExpected = new Date(expectedArrivalTime);
            transport.expectedArrivalTime.push(dateExpected);
            transport.timeLeftToArrival.push(subtractDates(dateExpected, new Date()));
        });
        transports.forEach((value, key) => {
            if(platforms.has(value.platform)){
                platforms.get(value.platform).push(value);
            }
            else{
                platforms.set(value.platform, [value]);
            }
        });
    })
    .catch(error => console.log("parsing failed", error));
    let platformKeys = Array.from( platforms.keys());
    return {platforms: platforms, platformKeys: platformKeys};
        
}

const getTransportationType = (lineId) => {
    var responseObj = new ResponseObj();
    let url = `http://reisapi.ruter.no/Line/GetDataByLineID/${lineId}`;
    return fetch(url)
    .then(result => result.json())
    .then((data) => {
        responseObj.setSuccess({transportation: TransportationType[data.Transportation], name: data.Name});
        return responseObj;
    })
    .catch((error) => {
        responseObj.setError("Could not load data.", error);
        return responseObj;
    });
}

const subtractDates = (newDate, oldDate) => {
    let ms = newDate.valueOf() - oldDate.valueOf();
    //let d, h, m, s;
    let m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    m = m % 60;
    //h = Math.floor(m / 60);
    
    //d = Math.floor(h / 24);
    //h = h % 24;
    return `${m} min:${s} sec  `;
    // shall do this return [ d, h, m, s ];
    //return { d: d, h: h, m: m, s: s };

}

class Transportation{
    constructor(destinationRef, lineNumber, destinationName, platform){
        this.destinationRef = destinationRef;
        this.lineNumber = lineNumber;
        this.destinationName = destinationName;
        this.platform = platform;
    }
    transportationType = "unknown";
    arrivalTime = [];
    expectedArrivalTime = [];
    timeLeftToArrival = [];
}

export {getStops, getRadiusOfPosition, getStopInformation, getTransportationType};