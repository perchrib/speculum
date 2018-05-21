import React, { Component } from 'react';
import './Clock.css'

const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class Clock extends Component {

	constructor(props) {
		super(props)
		this.state = {
			time: new Date()
		}
	}
	
	componentDidMount() {
		setInterval(this.update, 1000)
	}

	update = () => {
		this.setState({
			time: new Date()
		})
	};

	render(){
		let year = this.state.time.getFullYear();
		let month = Months[this.state.time.getMonth()]
		let day = this.state.time.getDate()
		let weekDay = Days[this.state.time.getDay()];
		return (
			<div>
				<div className="clock">
					<p>{this.state.time.toLocaleTimeString()}</p>
					{weekDay} {day} {month}
				</div>
			</div>
		);
	}
}
export default Clock;