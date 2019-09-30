import React from 'react';
import './LoginPage.css'
const LoginError = ({ error }) => {
  return (
    <div className={'error-wrapper'}>
      {error}
    </div>
  )
}

class LoginPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      error: '',
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    fetch('http://localhost:8080/login', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        const { success, message, results } = data;
        const { token, user } = results;
        if (success) {
          localStorage.setItem('jwt', token);
          localStorage.setItem('username', user.username);
          this.props.logUserIn(user);
          this.props.history.push('/admin/Cards');
        } else {
          this.setState({
            error: message,
          })
        }
      })
      .catch(err => {
        this.setState({
          error: err,
        })
      })
  }

  render() {
    const { username, password, error } = this.state;
    return (
      <div className={`login-page ${error ? 'error' : ''}`}>
        <form onSubmit={this.handleSubmit}>
          <div className="inputs">
            <div className="input-group">
              <input type="text" name={'username'} value={username} onChange={this.handleChange} />
            </div>
            <div className="input-group">
              <input type="password" name={'password'} value={password} onChange={this.handleChange} />
            </div>
          </div>
          {
            error ? <LoginError error={error} /> : null
          }
          <div className="submit-wrapper">
            <button className={'btn btn-block'}>Submit</button>
          </div>
        </form>
      </div>
    );
  }

}

export default LoginPage;
