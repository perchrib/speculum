import React, {Component} from 'react';
import { Collapse, Button, CardBody, Card, Col} from 'reactstrap';
import ToggleLine from './ToggleLine';


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

    static subtractDates(ms){
        let d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        return `${m} min:${s} sec  `;
        // shall do this return [ d, h, m, s ];
        //return { d: d, h: h, m: m, s: s };
    }
}

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
        let stationToCity = [];
        let stationFromCity = [];
        
        let transportations = new Map();
        var platforms = new Map();
        let arrivals = [];

        fetch(url)
        .then(result => result.json())
        .then((data) => {
            //console.log(data[0])
            data.forEach((element) => {
                //console.log(element.MonitoredVehicleJourney)
                let lineNumber = element.MonitoredVehicleJourney.LineRef;
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
                    transport = new Transportation(destinationRef, lineNumber, destinationName, platform);
                    transportations.set(destinationRef, transport);
                }
                transport.arrivalTime.push(new Date(aimedArrivalTime));
                var dateExpected = new Date(expectedArrivalTime);
                transport.expectedArrivalTime.push(dateExpected);
                transport.timeLeftToArrival.push(Transportation.subtractDates(dateExpected.valueOf() - new Date().valueOf()));
                

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
            //this.setState({platforms:platforms,platformKeys:platformKeys, time: new Date(), numUpdates: })
        })
        .catch(error => console.log("parsing failed", error))
    };

    update = () => {
        // this.setState({
		// 	time: new Date()
		// })
		this.updateApi();
	};


    render(){
        console.log("Parent -- " + this.state.time.toLocaleTimeString());
        
        const listItems = this.state.platformKeys.map((platformKey, index) =>
        <div key={index}>
            <h1>Platform {platformKey}</h1>
            <ToggleLine arrivals={this.state.platforms.get(platformKey)} time={this.state.time} numUpdates={this.state.numUpdates}/>
        {/* {transport.lineNumber}-{transport.destination}-<h1>{transport.platform}</h1>-{transport.timeLeftToArrival.h}:{transport.timeLeftToArrival.m}:{transport.timeLeftToArrival.s}  */}
        </div>);
        
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

export default ToggleStation;