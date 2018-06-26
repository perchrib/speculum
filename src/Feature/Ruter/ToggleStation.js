import React, {Component} from 'react';
import { Collapse, Button, CardBody, Card} from 'reactstrap';
import ToggleLine from './ToggleLine';
import {getStopInformation} from '../../Resources/RuterApi';

class ToggleStation extends Component{

    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {collapse: false, platforms: null, platformKeys:[], time: new Date(), numUpdates: 0, isLoading:false, errorMessage: "", error: ""};
    }

    toggle() {
        this.setState({collapse: !this.state.collapse });
    }

    componentDidMount(){
        this.updateApi();
        setInterval(this.updateApi, 5000);
    }

    updateApi = () =>{
        getStopInformation(this.props.id).then((response) => {
            if(response.success){
                this.setState((prevState, props) => ({
                    numUpdates: prevState.numUpdates + 1, platforms: response.data.platforms, platformKeys:response.data.platformKeys, time: new Date()
                }));
            }
            else{
                this.setState({isLoading:false, errorMessage: response.errorMessage});
            }
        })
    };

    render(){
        let lines = this.props.lines;
        const listItems = this.state.platformKeys.sort().map((platformKey) => {
            let lines = this.state.platforms.get(platformKey);
            return (<ToggleLine key={platformKey.toString()} platformNumber={platformKey} lines={lines} time={this.state.time} numUpdates={this.state.numUpdates}/>);
        }
        );
        
        return (
            <div>
            <Button  onClick={this.toggle} style={{ marginBottom: '1rem' }} size="lg" color="secondary" block>{this.props.name} - {this.props.distance}m </Button>
            <Collapse isOpen={this.state.collapse}>
                <Card>
                    <CardBody>
                    <div>
                    <h1>{this.props.name} {this.props.id}</h1>
                    
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