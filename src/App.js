import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Clock from './Feature/Clock';
import NearestStops from './Feature/Ruter/NearestStops';
import './App.css'
import getPosition from './Api/Location';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: {},
            isLoading: true,
            errorMessage: ""
        };
    }

    componentDidMount() {
        getPosition().then(response => {
            if (response.success) {
                this.setState({ position: response.data, isLoading: false });
            }
            else {
                this.setState({ isLoading: false, errorMessage: response.errorMessage });
            }
        });
    }

    render() {
        return (
            <Container fluid={true}>
                <Row>
                    <Col>
                        <Clock />
                    </Col>
                </Row>
                    <Col>
                        {/* {renderRuter(this.state.position, this.state.isLoading)} */}
                        <RenderRuter isLoading={this.state.isLoading} position={this.state.position} />
                    </Col>
                <Row>

                </Row>
            </Container>
        );
    }
}

const RenderRuter = (props) => {
    return (props.isLoading ? <span>Loading Position...</span> : <NearestStops utmEast={props.position.utmEast} utmNorth={props.position.utmNorth} />);
}

export default App;