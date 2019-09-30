import React from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from "mdbreact";
import { Link } from "react-router-dom";

class GradeFilesUploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      grades: [],
      selected_grade: null
    };
  }

  componentDidMount() {
    fetch("http://localhost:8080/grade")
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.setState({
            grades: data.results
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleRadioButton = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  onSubmit = async evt => {
    evt.preventDefault(); // stop the page from refreshing
    const { selected_grade, file } = this.state;
    if (!selected_grade) {
      alert("Please select a grade");
    } else if (!file) {
      alert("Please select a file");
    } else {
      const body = new FormData();
      body.append("file", file);
      body.append("grade_id", selected_grade);
      fetch("http://localhost:8080/file", { method: "POST", body })
        .then(response => {
          return response.json();
        })
        .then(answer => {
          if (answer.success) {
            this.fileInput.value = "";
            this.setState({
              file: null,
              selected_grade: null
            });
            alert("file uploaded sucessfully ");
          }
        })
        .catch(error => {
          debugger;
          alert("file was not uploaded. Please upload it using zip file !");
        });
    }
  };

  render() {
    return (

      <div>
        <section className="text-center my-5">

          <MDBRow>
            <MDBCol lg="5.5" md="12" className="mb-lg-0 mb-4">
              <MDBCard pricing className="white-text">
                <div className="purple-gradient rounded-top">
                  <h4
                    className="option"
                    style={{
                      padding: "2.5rem",
                      marginBottom: 0,
                      fontWeight: 500
                    }}
                  >
                    UPLOAD
              </h4>
                </div>
                <MDBCardBody className="striped black card-background px-5">
                  <ul>
                    <li>
                      <div className="container">
                        <div className="row">
                          <div className="col">
                            <h4>Select a Grade</h4>

                            <div className="grade-wrapper">
                              <select onChange={this.handleRadioButton} name='selected_grade'>
                                {this.state.grades.map((grade, index) => {
                                  return <option value={grade.id}>{grade.name}</option>;
                                })}
                              </select>
                            </div>
                            <br />
                            <div className="row">
                              <div className="col">
                                <h4>Select your file</h4>

                                <input
                                  type="file"
                                  name="file"
                                  ref={ref => (this.fileInput = ref)}
                                  onChange={e => {
                                    this.setState({
                                      file: e.target.files[0]
                                    });
                                  }}
                                  style={{ width: "550px" }}

                                />
                                {/* <input type="submit" value="Upload Photo" onClick={}/>  */}
                                <br />
                              </div>
                            </div>
                          </div>
                        </div>
                        <br />
                      </div>
                    </li>

                  </ul>

                  <MDBBtn rounded gradient="purple" className="mb-3 mt-3" onClick={this.onSubmit} >
                    Upload
              </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

          </MDBRow>
        </section>
      </div>

    );
  }
}

export default GradeFilesUploadPage;
