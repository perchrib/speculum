//Get Stations

function getRadiusOfPosition(utmEast, utmNorth, radius){
    const xmax = utmEast + radius;
    const xmin = utmEast - radius;
    const ymin = utmNorth - radius;
    const ymax = utmNorth + radius;
    return {xmin, xmax, ymin, ymax};
}
//get stations
const getStations = (utmEast, utmNorth, setStateCallback) => {
    const {xmin, xmax, ymin, ymax} = getRadiusOfPosition(utmEast, utmNorth, 500);
    var url = `http://reisapi.ruter.no/Place/GetStopsByArea?xmin=${xmin}&xmax=${xmax}&ymin=${ymin}&ymax=${ymax}`;
    var stations = [];
    fetch(url).then(result => result.json())
    .then((data) => {
        data.forEach(element => {
            let distance = getManhattenDistance(element.X, element.Y, utmEast, utmNorth);
            stations.push({name: element.Name, xpos: element.X, ypos: element.Y, id: element.ID, distance: distance});
        });
        stations.sort(function(a, b) {
            return parseFloat(a.distance) - parseFloat(b.distance);
        });
        setStateCallback(stations);
    })
    .catch(error => console.log("parsing failed", error));
    //return stations
}

const getManhattenDistance = (x, y, _x, _y) => {
    return Math.abs(x - _x) + Math.abs(y - _y);
}

//Get all information in a station
const getStationInformation = async (stationId) => {
    const url = `http://reisapi.ruter.no/StopVisit/GetDepartures/${stationId}`;
    let transportations = new Map();
    var platforms = new Map();
    console.log("fetch");
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
            
            var transport;
            if(transportations.has(destinationRef)){
                transport = transportations.get(destinationRef);
            }
            else{
                transport = new Transportation(destinationRef, lineId, destinationName, platform);
                transportations.set(destinationRef, transport);
            }
            transport.arrivalTime.push(new Date(aimedArrivalTime));
            var dateExpected = new Date(expectedArrivalTime);
            transport.expectedArrivalTime.push(dateExpected);
            transport.timeLeftToArrival.push(subtractDates(dateExpected, new Date()));
        });
        transportations.forEach((value, key) => {
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
    arrivalTime = [];
    expectedArrivalTime = [];
    timeLeftToArrival = [];
}

export {getStations, getRadiusOfPosition, getStationInformation};