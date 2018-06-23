import React, {Component} from 'react';
import { Collapse, Button, CardBody, Card} from 'reactstrap';
import ToggleLine from './ToggleLine';
import {getStationInformation} from '../../Resources/RuterApi';

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
        setInterval(this.update, 1000000)
    }

    updateApi = async () =>{
        var data = await getStationInformation(this.props.id);
        this.setState((prevState, props) => ({
            numUpdates: prevState.numUpdates + 1, platforms:data.platforms,platformKeys:data.platformKeys, time: new Date()
        }));
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

export default ToggleStation;