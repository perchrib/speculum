import React, { Component } from 'react';
import { Container, Row, Col} from 'reactstrap';
import Clock from './Feature/Clock';
import Ruter from './Feature/Ruter/Ruter';
import './App.css'

const utmObj = require('utm-latlng');
const utm=new utmObj();

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            position: {
                latitude: null,
                longitude: null,
                utmEast: null,
                utmNorth: null
            }

        }
    }

    async componentDidMount() {
        if ("geolocation" in navigator) {
            await this.loadPosition();
          }
      }

      //https://steemit.com/programming/@leighhalliday/converting-geolocation-from-callbacks-into-async-await-javascript
    async loadPosition() {
        try {
            const position = await this.getCurrentPosition();
            const { latitude, longitude } = position.coords;
            var {Easting, Northing}= utm.convertLatLngToUtm(latitude, longitude, 7);
            this.setState({
                position: {
                    latitude, 
                    longitude,
                    utmEast: Easting,
                    utmNorth: Northing
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    
    getCurrentPosition(options = {}){
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    };

    render(){
        return (
        <Container fluid={true}>
            <Row>
                <Col>
                    <Clock />
                </Col>
            </Row>
                <Col>
                    <Ruter position={(this.state.position)}/>
                </Col>
            <Row>
                
            </Row>
        </Container>
        );
    }
}

export default App;