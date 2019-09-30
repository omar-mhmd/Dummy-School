import React from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from "mdbreact";
import { Link } from "react-router-dom";

const Cards = () => {
  return (
    <section className="text-center my-5">
      <h2 className="h1-responsive font-weight-bold text-center my-5">
        Welcome
      </h2>
    <MDBRow>
        <MDBCol lg="4" md="12" className="mb-lg-0 mb-4">
          <MDBCard pricing className="white-text">
            <div className="aqua-gradient rounded-top">
              <h4
                className="option"
                style={{
                  padding: "2.5rem",
                  marginBottom: 0,
                  fontWeight: 500
                }}
              >
                Professor
              </h4>
            </div>
            <MDBCardBody className="striped black card-background px-5">
              <ul>
                <li>
                  <p>
                    <strong></strong> In order to generate professor voucher codes plz press the button below
                  </p>
                </li>
               
              </ul>
              <Link to="/admin/professorpin">
              <MDBBtn rounded gradient="aqua" className="mb-3 mt-3">
                Professor Pin
              </MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol lg="4" md="12" className="mb-lg-0 mb-4">
          <MDBCard pricing className="white-text">
            <div className="peach-gradient rounded-top">
              <h4
                className="option"
                style={{
                  padding: "2.5rem",
                  marginBottom: 0,
                  fontWeight: 500
                }}
              >
                Student
              </h4>
            </div>
            <MDBCardBody className="striped black card-background px-5">
              <ul>
                <li>
                  <p>
                    <strong></strong> In order to generate students voucher codes plz press the button below
                  </p>
                </li>
                
              </ul>
              <Link to="/admin/studentpin">
              <MDBBtn rounded gradient="peach"  className="mb-3 mt-3">
                Student pin
              </MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol lg="4" md="12" className="mb-lg-0 mb-4">
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
                Upload
              </h4>
            </div>
            <MDBCardBody className="striped black card-background px-5">
              <ul>
                <li>
                  <p>
                    <strong></strong> If you what to Upload a new book please press the button below
                  </p>
                </li>
              </ul>
              <Link to="/admin/file">
              <MDBBtn rounded gradient="purple" className="mb-3 mt-3" >
                upload
              </MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </section>
  );
}

export default Cards;





