import React, {Component} from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

class ToggleLine extends Component{
    constructor(props){
        super(props);
        //this.state = {arrivals:props.arrivals, time:props.time, numUpdates: props.numUpdates, platformNumber:props.platformNumber}
    }

    // componentWillReceiveProps(nextProps){
    //     if(nextProps.time > this.props.time && nextProps.numUpdates > this.props.numUpdates){
    //         this.setState({arrivals: nextProps.arrivals, time: nextProps.time, numUpdates: nextProps.numUpdates});
    //     }
    // }

    render(){
        const platformList = this.props.lines.map((line) =>
        <ListGroup key={line.id.toString()}>
            <ListGroupItem>
                <ListGroupItemHeading>{line.type} {line.name} - To {line.destinationName}</ListGroupItemHeading>
                    <Times arrivals={line.timeLeftToArrival}/>
            </ListGroupItem>
        </ListGroup>
        );

        return (
            <div>
            <h2>Platform {this.props.platformNumber}</h2>    
            {this.props.lines.length > 0 ? platformList : <span>Ingenting</span>}
            </div>
        );
    }
}

function Times(props){
    const arrivals = props.arrivals.slice(0,7);
    const listItem = arrivals.map((time, index) => 
        <span key={index}> {time}</span>
    );
    return <ListGroupItemText>{listItem}</ListGroupItemText >;
}

export default ToggleLine;