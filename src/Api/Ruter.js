import RequestService from '../Services/RequestService';

var transportationLineTypes = new Map();

const storeLines = (lines) => {
    lines.forEach(line => {
        transportationLineTypes.set(line.ID, {name: line.Name, type: TransportationType[line.Transportation]});
    })
}

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

function getRadiusOfPosition(utmEast, utmNorth, radius){
    const xmax = utmEast + radius;
    const xmin = utmEast - radius;
    const ymin = utmNorth - radius;
    const ymax = utmNorth + radius;
    return {xmin, xmax, ymin, ymax};
}
// returns n numbers of nearest stops. 
const getNearestStops = async (utmEast, utmNorth) => {
    const {xmin, xmax, ymin, ymax} = getRadiusOfPosition(utmEast, utmNorth, 500);
    let url = `https://reisapi.ruter.no/Place/GetStopsByArea?xmin=${xmin}&xmax=${xmax}&ymin=${ymin}&ymax=${ymax}`;
    let stops = [];
    let response = await RequestService.get(url);

    if(response.success){
        response.data.forEach(element => {
            let distance = getManhattenDistance(element.X, element.Y, utmEast, utmNorth);

            storeLines(element.Lines);
            //debugger;
            stops.push({name: element.Name, xpos: element.X, ypos: element.Y, id: element.ID, distance: distance});
        });
        stops.sort(function(a, b) {
            return parseFloat(a.distance) - parseFloat(b.distance);
        });
        response.data = stops;
        return response;
    }
    return response;
}

const getManhattenDistance = (x, y, _x, _y) => {
    return Math.abs(x - _x) + Math.abs(y - _y);
}

//Get all information in a stop
const getStopInformation = async (stationId) => {
    const url = `https://reisapi.ruter.no/StopVisit/GetDepartures/${stationId}`;
    let response = await RequestService.get(url);
    if (response.success) {
        let lines = new Map();
        let platforms = new Map();
        // iterate over all lines on a station, a station can have sevaral platforms, 
        // platforms have lines... 
        response.data.forEach((element) => {
            let lineId = parseInt(element.MonitoredVehicleJourney.LineRef, 10);
            let destinationName = element.MonitoredVehicleJourney.DestinationName;
            let destinationref = element.MonitoredVehicleJourney.DestinationRef;
            let platform = element.MonitoredVehicleJourney.MonitoredCall.DeparturePlatformName;

            let aimedArrivalTime = element.MonitoredVehicleJourney.MonitoredCall.AimedArrivalTime;
            let expectedArrivalTime = element.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime;

            //Bug in ruterAPI same destinationref for some lines...
            let GUID = destinationref + lineId;
            var transport;
            if (lines.has(GUID)) {
                transport = lines.get(GUID);
            }
            else {
                let lineName = transportationLineTypes.get(lineId).name;
                let lineType = transportationLineTypes.get(lineId).type;
                transport = new Line(GUID, lineId, lineName, lineType, destinationName, platform);
                lines.set(GUID, transport);
            }

            transport.arrivalTime.push(new Date(aimedArrivalTime));
            var dateExpected = new Date(expectedArrivalTime);
            transport.expectedArrivalTime.push(dateExpected);
            transport.timeLeftToArrival.push(subtractDates(dateExpected, new Date()));
        });
        lines.forEach((value, key) => {
            if (platforms.has(value.platform)) {
                platforms.get(value.platform).push(value);
            }
            else {
                platforms.set(value.platform, [value]);
            }
        });
        var stopData = [];
        let platformKeys = Array.from(platforms.keys());
        platformKeys.sort();
        platformKeys.forEach((key) => {
            stopData.push({platform: key, lines: platforms.get(key)});
        });
        response.data = stopData;
        return response;
    }
    return response;
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

class Line{
    constructor(guid, lineId, name, type, destinationName, platform){
        this.id = guid;
        this.lineId = lineId;
        this.name = name;
        this.type = type;
        this.destinationName = destinationName;
        this.platform = platform;
    }
    arrivalTime = [];
    expectedArrivalTime = [];
    timeLeftToArrival = [];
}

export {getNearestStops, getRadiusOfPosition, getStopInformation};