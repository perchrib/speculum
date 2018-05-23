import React, {Component} from 'react';
import { Collapse, Button, CardBody, Card} from 'reactstrap';
import ToggleLine from './ToggleLine';

class ToggleStation extends Component{

    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {collapse: false, name: props.name, distance: props.distance, id: props.id, platforms: null, platformKeys:[], time: new Date(), numUpdates: 0}
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    componentDidMount(){
        this.updateApi();
        setInterval(this.update, 10000)
    }

    updateApi = () =>{
        const stationId = this.state.id;
        const url = `http://reisapi.ruter.no/StopVisit/GetDepartures/${stationId}`;
        
        let transportations = new Map();
        var platforms = new Map();

        fetch(url)
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
            let platformKeys = Array.from( platforms.keys());
            //console.log(platformKeys);
            //debugger;

            this.setState((prevState, props) => ({
                numUpdates: prevState.numUpdates + 1, platforms:platforms,platformKeys:platformKeys, time: new Date()
              }));
        })
        .catch(error => console.log("parsing failed", error))
    };

    update = () => {
		this.updateApi();
	};
    render(){
        const listItems = this.state.platformKeys.sort().map((platformKey) =>
            <ToggleLine key={platformKey.toString()} platformNumber={platformKey} arrivals={this.state.platforms.get(platformKey)} time={this.state.time} numUpdates={this.state.numUpdates}/>
        );
        
        return (
            <div>
            <Button  onClick={this.toggle} style={{ marginBottom: '1rem' }} size="lg" color="secondary" block>{this.state.name} - {this.state.distance}m </Button>
            <Collapse isOpen={this.state.collapse}>
                <Card>
                    <CardBody>
                    <div>
                    <h1>{this.state.name} {this.state.id}</h1>
                    
                    <div>{listItems}</div>
                    </div>
        
                    </CardBody>
                </Card>
            </Collapse>
            </div>
        );
    }
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

export default ToggleStation;