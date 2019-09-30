import React, { Component } from "react";
import Image from "../../assets/images/ggg.jpg";
import Footer from "../../components/Footer/Footer.js"
import "./HomePage.css";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherPin: false,
      studentPin: false,
      pin: ''
    };
  }
  handleInput = () => {
    this.setState({
      teacherPin: !this.state.teacherPin
    });
  };
  handleInput2 = () => {
    this.setState({
      studentPin: !this.state.studentPin
    });
  };

  onSubmitStudent = async evt => {
    evt.preventDefault()
    const body = new FormData();

    body.append('pin', (this.state.pin));
    const response = await fetch(`http://localhost:8080/studentspin`, { method: 'POST', body });
    const answer = await response.json();
    if (answer.success === false) {
      alert('Your PIN is wrong')
    } else {
      this.props.history.push('/Pin')
    }
  }

  onSubmitTeacher = async evt => {
    evt.preventDefault()
    const body = new FormData();
    body.append('pin', (this.state.pin));
    const response = await fetch(`http://localhost:8080/teacherpin`, { method: 'POST', body });
    const answer = await response.json();
    if (answer.success === false) {
      alert('Your PIN is wrong')
    } else {
      this.props.history.push('/Pin')
    }
  }


  render() {
    return (
      <div className="HomePage">
        <img src={Image} className="page-section image-background" />
        <section class=" page-section ftco-services ftco-no-pb">
          <div class="container-wrap">
            <div class="row no-gutters">
              <div
                class="col-md-6 d-flex services align-self-stretch   ftco-animate bg-primary"
                id="widthy"
              >
                <div class="media block-6 d-block text-center">
                  <div class="icon d-flex justify-content-center align-items-center">
                    <span class="flaticon-teacher">
                      <i
                        class="fas fa-book-reader"
                        onClick={this.handleInput}
                      ></i>
                    </span>
                  </div>
                  <div class="media-body p-2 mt-3">
                    <h3 class="heading">Teachers</h3>
                    {this.state.teacherPin && (
                      <>
                        <input type="text"
                          className="inputPin"
                          placeholder="Please Enter Your Pin"
                          value={this.state.pin}
                          onChange={e => this.setState({
                            pin: e.target.value,
                          })} />

                        <button type="submit" onClick={this.onSubmitTeacher}>OK</button>
                      </>
                    )}
                    <p>
                      Even the all-powerful Pointing has no control about the
                      blind texts it is an almost unorthographic.
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-6 d-flex services align-self-stretch  ftco-animate bg-tertiary">
                <div class="media block-6 d-block text-center">
                  <div class="icon d-flex justify-content-center align-items-center">
                    <span class="flaticon-reading">
                      <i
                        class="fas fa-chalkboard-teacher"
                        onClick={this.handleInput2}
                      ></i>
                    </span>
                  </div>
                  <div class="media-body p-2 mt-3">
                    <h3 class="heading">Students</h3>
                    {this.state.studentPin && (
                      <>
                        <input type="text"
                          className="inputPin"
                          placeholder="Please Enter Your Pin"
                          value={this.state.pin}
                          onChange={e => this.setState({
                            pin: e.target.value,
                          })} />
                        <button type="submit" onClick={this.onSubmitStudent}>OK</button>
                      </>
                    )}
                    <p>
                      Even the all-powerful Pointing has no control about the
                      blind texts it is an almost unorthographic.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </section>
        <div className="page-section "></div>
      </div>
    );
  }
}

export default HomePage;
