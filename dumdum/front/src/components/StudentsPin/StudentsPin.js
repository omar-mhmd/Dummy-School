import React, { Component } from 'react';


class StudentsPin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: '',
    }
  }
  
  
  onSubmit = async evt => {
    evt.preventDefault()
    const body = new FormData();
    
    body.append('pin', (this.state.pin));
    const response = await fetch(`http://localhost:8080/studentspin`, {method: 'POST', body});
    const answer = await response.json();
    if (answer.success === false) {
      alert('Your PIN is wrong')
    } else {
      this.props.history.push('/Pin')
    }
  }
  
  render() {
    return (
        <div>
          <input type="text"
                 value={this.state.pin}
                 onChange={e => this.setState({
                   pin: e.target.value,
                 })}/>
          <button type="submit" onClick={this.onSubmit}>Submit</button>
        </div>
    );
  }
}

export default StudentsPin;
