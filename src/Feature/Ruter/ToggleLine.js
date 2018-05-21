import React, {Component} from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

class ToggleLine extends Component{
    constructor(props){
        super(props);
        this.state = {arrivals:props.arrivals, time:props.time, numUpdates: props.numUpdates}
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.time > this.props.time && nextProps.numUpdates > this.props.numUpdates){
            this.setState({arrivals: nextProps.arrivals, time: nextProps.time, numUpdates: nextProps.numUpdates});
        }
        //console.log("Updated - " + nextProps.time.toLocaleTimeString())
    }

    render(){
        //console.log("Child - " + this.state.time.toLocaleTimeString())
        const platformList = this.state.arrivals.map((arrivals, index) =>
        <ListGroup key={index}>
            <ListGroupItem>
                <ListGroupItemHeading> Nr {arrivals.lineNumber} - To {arrivals.destinationName}</ListGroupItemHeading>
                    {/* <ListGroupItemText>
                        {arrivals.timeLeftToArrival.map((time) => <p>{time}</p>)}
                    </ListGroupItemText> */}
                    <Times arrivals={arrivals.timeLeftToArrival}/>
            </ListGroupItem>
        </ListGroup>
        );

        return (
            <div>
                {platformList}
            </div>
        );
    }
}

// const Times = ({arrivals}) =>{
//     const listItem = arrivals.map((time, index) => 
//         <div key={index}> {time}</div>
//     );
//     return ({listItem});
// }

function Times(props){
    const arrivals = props.arrivals;
    const listItem = arrivals.map((time, index) => 
        <span key={index}> {time}</span>
    );
    return <ListGroupItemText>{listItem}</ListGroupItemText >;
}

export default ToggleLine;