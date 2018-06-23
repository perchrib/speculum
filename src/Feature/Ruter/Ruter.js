import React, {Component} from 'react';
import ToggleStation from './ToggleStation';
import {getStations, getRadiusOfPosition} from '../../Resources/RuterApi';

class Ruter extends Component{
    constructor(props){
        super(props)
        this.state = {stations: []};
    }

    componentDidMount(){
        getStations(this.props.utmEast, this.props.utmNorth, (data) => {
            this.setState({stations: data});
        });
    }

    render(){
        const {xmin, xmax, ymin, ymax} = getRadiusOfPosition(this.props.utmEast, this.props.utmNorth, 300);
        var url = `http://reisapi.ruter.no/Place/GetStopsByArea?xmin=${xmin}&xmax=${xmax}&ymin=${ymin}&ymax=${ymax}`;
        return(
            <div>
                <h1>Ruter</h1>
                <a href={url}>Url</a>
                <p>{url}</p>
                <h2>X</h2>
                    <p>{this.props.utmEast} -- {this.props.utmEast + 500}</p>
                <h2>Y</h2>
                    <p>{this.props.utmNorth} -- {this.props.utmNorth + 500}</p>
                <h1 style={{textAlign: 'center'}} >Nearest Stations</h1>
                {renderStations(this.state.stations)}
            </div>
        );
    }
}
const renderStations = (stations) => {
    return (stations ? 
        stations.map((station) =>
        <ToggleStation key={station.id.toString()} name={station.name} distance={station.distance} id={station.id}/>) : <span>laoading</span>
    );
}

export default Ruter;