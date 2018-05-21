import React, {Component} from 'react';
import ToggleStation from './ToggleStation';


class Station {
    constructor(name, xpos, ypos, id, yourLocation){
        this.name = name;
        this.xpos = xpos;
        this.ypos = ypos;
        this.id = id;
        this.distance = this.getManhattenDistance(xpos, ypos, yourLocation);
    }

    getManhattenDistance(x, y, yourLocation){
        return Math.abs(x - yourLocation[0]) + Math.abs(y - yourLocation[1])
    }

}

class Ruter extends Component{
    constructor(props){
        super(props)
        this.state = {utmEast: null, utmNorth: null, stations: []};

    }

    componentWillReceiveProps(nextProps){

        if(nextProps.position.latitude !== this.props.position.latitude && nextProps.position.longitude !== this.props.position.longitude){
            const eastString = parseInt(nextProps.position.utmEast.toString().split('.')[0]);
            const northString = parseInt(nextProps.position.utmNorth.toString().split('.')[0]);
            
            this.setState({utmEast: eastString, utmNorth:northString}, function() {
                this.getStations();      
            });
        }
    }

    getRadiusOfPosition(radius){
        const xmin = this.state.utmEast - radius;
        const xmax = this.state.utmEast + radius;
        const ymin = this.state.utmNorth - radius;
        const ymax = this.state.utmNorth + radius;
        return {xmin, xmax, ymin, ymax};
    }
    
    getStations(){
        const {xmin, xmax, ymin, ymax} = this.getRadiusOfPosition(500);
        var url = `http://reisapi.ruter.no/Place/GetStopsByArea?xmin=${xmin}&xmax=${xmax}&ymin=${ymin}&ymax=${ymax}`;
        var stations = [];
        fetch(url).then(result => result.json())
        .then((data) => {
            console.log("url -- " + url)
            console.log(data)
            
            data.forEach(element => {
                stations.push(new Station(element.Name, element.X, element.Y, element.ID, [this.state.utmEast, this.state.utmNorth]))
                console.log(element.Name)
            });
            stations.sort(function(a, b) {
                return parseFloat(a.distance) - parseFloat(b.distance);
            });
            
            this.setState({stations});
            console.log("mhm");
            console.log(stations);
        })
        .catch(error => console.log("parsing failed", error));
    }

    render(){
        const listItems = this.state.stations.map((station) =>
        <ToggleStation key={station.id.toString()} name={station.name} distance={station.distance} id={station.id}/>);

        const {xmin, xmax, ymin, ymax} = this.getRadiusOfPosition(300);
        var url = `http://reisapi.ruter.no/Place/GetStopsByArea?xmin=${xmin}&xmax=${xmax}&ymin=${ymin}&ymax=${ymax}`;
        return(
            <div>
                <h1>Ruter</h1>
                <a href={url}>Url</a>
                <p>{url}</p>
                <h2>X</h2>
                    <p>{this.state.utmEast} -- {this.state.utmEast + 500}</p>
                <h2>Y</h2>
                    <p>{this.state.utmNorth} -- {this.state.utmNorth + 500}</p>
                <h1 style={{textAlign: 'center'}} >Nearest Stations</h1>
                {listItems}
            </div>
        );
    }

}

export default Ruter;