import React, { Component } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBModalFooter,
  MDBIcon,
  MDBCardHeader,
  MDBBtn,
  MDBInput,
} from 'mdbreact';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }
  
  password = () => {
    this.props.history.push('/passwordforget')
  }
  
  
  onSubmit = async evt => {
    evt.preventDefault()
    const body = new FormData();
    body.append('username', (this.state.username));
    body.append('password', (this.state.password))
    const response = await fetch(`http://localhost:8080/login`, {method: 'POST', body});
    const answer = await response.json();
    if (answer.success === false) {
      alert('Your Email or Password Worng')
    } else {
      this.props.history.push('/Pin')
    }
    
  }
  
  
  render() {
    return (
        <MDBContainer>
          <MDBRow>
            <MDBCol md="6">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardHeader className="form-header deep-blue-gradient rounded">
                    <h3 className="my-3">
                      <MDBIcon icon="lock"/> Login:
                    </h3>
                  </MDBCardHeader>
                  <form>
                    <div className="grey-text">
                      <MDBInput
                          label="Type your Username"
                          icon="envelope"
                          group
                          type="text"
                          
                          error="wrong"
                          success="right"
                          value={this.state.username}
                          onChange={e => this.setState({username: e.target.value})}
                      />
                      <MDBInput
                          label="Type your password"
                          icon="lock"
                          group
                          type="password"
                          validate
                          value={this.state.password}
                          onChange={e => this.setState({password: e.target.value})}
                      />
                    </div>
                    
                    <div className="text-center mt-4">
                      <MDBBtn
                          color="light-blue"
                          className="mb-3"
                          type="submit"
                          onClick={this.onSubmit}
                      >
                        Login
                      </MDBBtn>
                    </div>
                  </form>
                  <MDBModalFooter>
                    <div className="font-weight-light">
                      <MDBBtn
                          color="light-blue"
                          className="mb-3"
                          onClick={this.password}
                      >
                        Forget Password
                      
                      </MDBBtn>
                    </div>
                  
                  </MDBModalFooter>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
    );
  }
}

export default Login;
