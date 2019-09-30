import React, { Component } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCardHeader,
  MDBBtn,
  MDBInput,
} from 'mdbreact';

class PasswordForget extends Component {
  
  state = {
    email: '',
  }
  
  onSubmit = async evt => {
    evt.preventDefault()
    const body = new FormData();
    body.append('email', (this.state.email));
    const response = await fetch(`http://localhost:8080/password`, {method: 'POST', body});
    const answer = await response.json();
    if (answer.success === false) {
      alert('Your Email is wrong')
    } else {
      alert('ok')
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
                      <MDBIcon icon="lock"/> Forget Password
                    </h3>
                  </MDBCardHeader>
                  <form>
                    <div className="grey-text">
                      <MDBInput
                          label="Type your Email"
                          icon="envelope"
                          group
                          type="text"
                          
                          error="wrong"
                          success="right"
                          value={this.state.email}
                          onChange={e => this.setState({email: e.target.value})}
                      />
                    
                    </div>
                    
                    <div className="text-center mt-4">
                    
                    </div>
                  </form>
                  
                  <MDBBtn
                      color="light-blue"
                      className="mb-3"
                      onClick={this.onSubmit}
                      type="submit"
                  >
                    Send Confirmation
                  
                  </MDBBtn>
                
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
    );
  }
};

export default PasswordForget;
