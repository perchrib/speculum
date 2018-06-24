import React, {Component} from 'react';
import ToggleStation from './ToggleStation';
import {getStops, getRadiusOfPosition, getTransportationType} from '../../Resources/RuterApi';

class Ruter extends Component{
    constructor(props){
        super(props)
        this.state = {stops: [], isLoading: true, errorMessage: ""};
    }

    componentDidMount(){
        getStops(this.props.utmEast, this.props.utmNorth).then((response) => {
            if(response.success){
                this.setState({stops: response.data, isLoading:false});
            }
            else{
                this.setState({isLoading:false, errorMessage: response.errorMessage});
            }
        });
        getTransportationType(12).then((data) => {
            console.log("test");
            console.log(data);
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
                <h1 style={{textAlign: 'center'}} >Nearest Stops</h1>
                {renderStops(this.state.stops)}
            </div>
        );
    }
}
const renderStops = (stops) => {
    return (stops ? 
        stops.map((stop) =>
        <ToggleStation key={stop.id.toString()} name={stop.name} distance={stop.distance} id={stop.id}/>) : <span>laoading</span>
    );
}

export default Ruter;