import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Clock from './Feature/Clock';
import Ruter from './Feature/Ruter/Ruter';
import './App.css'
import getPosition from './Resources/Location';

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
                    {renderRuter(this.state.position, this.state.isLoading)}
                </Col>
                <Row>

                </Row>
            </Container>
        );
    }
}

const renderRuter = (position, isLoading) => {
    return (isLoading ? <span>Loading Position...</span> : <Ruter utmEast={position.utmEast} utmNorth={position.utmNorth} />);
}

export default App;