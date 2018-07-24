import React, {Component} from 'react';
import { Collapse, Button, CardBody, Card} from 'reactstrap';
import ToggleLine from './ToggleLine';
import {getStopInformation} from '../../Api/Ruter';

class ToggleStop extends Component{

    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {collapse: false, stopInformation:[], time: new Date(), numUpdates: 0, isLoading:false, errorMessage: "", error: ""};
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
                //let platforms = response.data.map(element => element.platform);
                this.setState((prevState, props) => ({
                    numUpdates: prevState.numUpdates + 1, stopInformation:response.data, time: new Date()
                }));
            }
            else{
                this.setState({isLoading:false, errorMessage: response.errorMessage});
            }
        })
    };

    render(){
        var listItems = "jadda";
        if (this.state.stopInformation.length > 0 ){
            listItems = this.state.stopInformation.map((element) => {
                //let lines = this.state.stopInformation[index].get(platform);
                return (<ToggleLine key={element.platform.toString()} platformNumber={element.platform} lines={element.lines} time={this.state.time} numUpdates={this.state.numUpdates}/>);
            });
        }
        return (
            <div>
            <Button  onClick={this.toggle} style={{ marginBottom: '1rem', whiteSpace: "inherit"}} size="lg" color="info" block>{this.props.name} - {this.props.distance}m </Button>
            <Collapse isOpen={this.state.collapse}>
                <Card>
                    <CardBody  style={{padding: "5px 5px 5px 5px"}}>
                    <div>
                    {/* <h1>{this.props.name} {this.props.id}</h1> */}
                    <h1 style={{textAlign:'center'}}>{this.props.name}</h1>
                    
                    <div>{listItems}</div>
                    </div>
        
                    </CardBody>
                </Card>
            </Collapse>
            </div>
        );
    }
}

export default ToggleStop;