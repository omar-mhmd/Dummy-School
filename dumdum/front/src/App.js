import GradeFilesUploadPage from './Pages/GradeFilesUploadPage/GradeFilesUploadPage'
import React, { Component } from 'react';
// import Pin from './Pin.js';
// import Login from './components/Login/Login'
import LoginPage from './Pages/LoginPage/LoginPage.js'
import HomePage from './Pages/HomePage/HomePage';
import ProfessorPinPage from './Pages/ProfessorPinPage/ProfessorPinPage';
import StudentPinPage from './Pages/StudentPinPage/StudentPinPage';
// import WindowGame from './Pages/Games/game1.js';
import Books from './Pages/Chapters/Chapters.js'
import Cards from './components/Cards/cards.js'

// import PasswordForget from './components/PasswordForget/PasswordForget';
import { Switch, Route, withRouter } from 'react-router-dom';

import Header from './Header.js';

class Appe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: {
        loggedIn: false,
        user: null,
      },
      file: null,
      file_name: '',
    }
  }
  componentDidMount() {
    const jwt_token = localStorage.getItem('jwt');
    const username = localStorage.getItem('username');
    fetch('http://localhost:8080/check_token', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
      },
      body: JSON.stringify(
        {
          'token': jwt_token,
          username,
        },
      ),
    })
      .then(response => response.json())
      .then(data => {
        const { success, results } = data;
        const { user } = results;
        debugger
        if (success) {
          this.setState({
            auth: {
              user: success ? user : null,
              loggedIn: success,
            },
          }, () => {
            // window.location = '/admin/cards'
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  logUserIn = (user) => {
    this.setState({
      auth: {
        loggedIn: true,
        user,
      },
    })
  }

  getPickerValue = (value) => {
  }

  render() {
    return (
      <div className={"App"}>
        {/* <Header/> */}

        <Switch>
          <Route path={"/"} exact render={props => <HomePage {...props} />}/>
          <Route path={"/books"} exact render={props =><Books  {...props} />}/>
          {/* <Route path="/game" exact render={props => <WindowGame {...props} />} /> */}

          {this.state.auth.loggedIn ? (
            <>
              <Route
                path="/admin/studentpin"
                exact
                render={props => <StudentPinPage {...props} />}
              />
              <Route
                path="/admin"
                exact
                render={props => <Cards {...props} />}
              />

              <Route
                path="/admin/professorpin"
                exact
                render={props => <ProfessorPinPage {...props} />}
              />
              <Route
                path="/admin/file"
                exact
                render={props => <GradeFilesUploadPage {...props} />}
              />
            </>
          ) : (
            <Route
              path="/admin"
              render={props => (
                <LoginPage {...props} logUserIn={this.logUserIn} />
              )}
            />
          )}
        </Switch>
      </div>
    );
  }
}

export default withRouter(Appe);
