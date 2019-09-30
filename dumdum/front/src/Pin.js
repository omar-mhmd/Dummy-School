import React, { Component } from 'react';
import Toggle from './components/Toogle';
import 'terminal.css';
import './assets/css/index.css';
// import Header from "./Header.js"
import sun from './assets/images/sun.png';
import moon from './assets/images/moon.png';
import ClipBoard from './components/ClipBoard/ClipBoard';
import { RandomPassword } from './utils/RandomPassword';

const root = document.documentElement;
const theme = {
  dark: {
    background: '#222225',
    font: '#ffffff',
  },
  light: {
    background: '#ffffff',
    font: '#222225',
  },
};

class Pin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      length: 8,
      count: '',
      pwd: [],
      upperCase: true,
      lowerCase: true,
      numeric: true,
      symbol: false,
      theme: 'light',
      date: '',
    };
  }
  
  onSubmit = async evt => {
    
    const body = new FormData();
    // filesArray.map((file, index) => body.append(`files[${index}]`, file))
    body.append('pwd', JSON.stringify(this.state.pwd));
    body.append('date', JSON.stringify(this.state.date))
    const response = await fetch(`http://localhost:8080/insertpin`, {method: 'POST', body});
    const answer = await response.json();
  }
  
  
  componentDidMount() {
    this.generatePwd();
  }
  generatePwd(evt) {
    const {upperCase, lowerCase, numeric, symbol, length, count} = this.state;
    let pwd = new RandomPassword()
        .setLength(length)
        .setCount(count)
        .setLowerCase(lowerCase)
        .setUpperCase(upperCase)
        .setNumberCase(numeric)
        .setSymbol(symbol)
        .generate();
    this.setState({pwd}, () => {
      this.onSubmit(evt)
    });
  }
  
  handleCheckbox(e) {
    const {name, checked} = e.target;
    this.setState({
      [name]: checked,
    });
    // this.generatePwd();
  }
  
  changeTheme(e) {
    this.setState({
      theme: e.target.checked ? 'dark' : 'light',
    });
    root.style.setProperty('--background-color', theme[this.state.theme].font);
    root.style.setProperty('--font-color', theme[this.state.theme].background);
  }
  render() {
    
    return (
        <div>
          {/* <Header/> */}
          <div className="container" style={{marginTop: 20}}>
            <section>
              <header>
                <div className="row">
                  <div className="col">
                    <h1 className=" terminal-prompt">
                      Generate a secure password
                    </h1>
                  </div>
                  <div className="col">
                    <div className="switch">
                      <Toggle
                          icons={{
                            checked: (
                                <img
                                    src={moon}
                                    width="16"
                                    height="16"
                                    role="presentation"
                                    alt="dark"
                                    style={{pointerEvents: 'none'}}
                                />
                            ),
                            unchecked: (
                                <img
                                    src={sun}
                                    width="16"
                                    height="16"
                                    role="presentation"
                                    alt="light"
                                    style={{pointerEvents: 'none'}}
                                />
                            ),
                          }}
                          checked={this.state.theme === 'dark'}
                          onChange={e => this.changeTheme(e)}
                      />
                    </div>
                  </div>
                </div>
              </header>
              <div className="input-container">
                <input
                    id="input"
                    className={this.state.theme}
                    name="password"
                    type="text"
                    readOnly
                    value={this.state.pwd.map(item =>
                        item)}
                />
                
                <div className="clipboard">
                  <ClipBoard theme={this.state.theme}/>
                </div>
              </div>
            </section>
            <hr/>
            <section>
              <header>
                <h3>Customize your password</h3>
              </header>
              <fieldset>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label className="checkbox-container">
                        Uppercase
                        <input
                            type="checkbox"
                            checked={this.state.upperCase}
                            name="upperCase"
                            onChange={e => this.handleCheckbox(e)}
                        />
                        <span className="checkmark"/>
                      </label>
                      <label className="checkbox-container">
                        Lowercase
                        <input
                            type="checkbox"
                            checked={this.state.lowerCase}
                            name="lowerCase"
                            onChange={e => this.handleCheckbox(e)}
                        />
                        <span className="checkmark"/>
                      </label>
                      <label className="checkbox-container">
                        Numeric
                        <input
                            type="checkbox"
                            checked={this.state.numeric}
                            name="numeric"
                            onChange={e => this.handleCheckbox(e)}
                        />
                        <span className="checkmark"/>
                      </label>
                      <label className="checkbox-container">
                        Symbols
                        <input
                            type="checkbox"
                            checked={this.state.symbol}
                            name="symbol"
                            onChange={e => this.handleCheckbox(e)}
                        />
                        <span className="checkmark"/>
                      </label>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <div className="row">
                        <div className="col">
                          <label htmlFor="email">Password Length:</label>
                          &nbsp;&nbsp;
                        </div>
                        <div className="col">
                          <input
                              type="number"
                              min="8"
                              max="40"
                              style={{width: 65}}
                              value={this.state.length}
                              onChange={e => {
                                this.setState({length: e.target.value});
                                this.generatePwd();
                              }}
                          />
                        </div>
                      </div>
                      &nbsp;
                      <div className="slider-container">
                        <input className="slider" type="range" min="8" max="40" value={this.state.length}
                               onChange={e => {
                                 this.setState({length: e.target.value}, () => {
                                   this.generatePwd();
                                 });
                               }}
                        />
                      </div>
                    </div>
                    &nbsp;
                    
                    <div className="col">
                      <div className="form-group">
                        <div className="row">
                          <div className="col">
                            <label htmlFor="email">Password Count:</label>
                            &nbsp;&nbsp;
                          </div>
                          <div className="col">
                            <input type="number" min="1" max="40" style={{width: 65}} value={this.state.count}
                                   onChange={e => {
                                     this.setState({count: e.target.value});
                              
                                   }}
                            />
                          </div>
                          
                          <div className="col">
                            <label htmlFor="email">Expiry Date:</label>
                            &nbsp;&nbsp;
                          </div>
                          <br/>
                          <div className="col">
                            <input type="date" style={{width: 150}} value={this.state.date}
                                   onChange={e => {
                                     this.setState({date: e.target.value});
                              
                                   }}
                            />
                          </div>
                        </div>
                        &nbsp;
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <br/>
              <div style={{textAlign: 'left'}}>
                <div className="row">
                  <div className="col">
                    <button className="btn  btn-primary" onClick={(evt) => {
                      this.generatePwd(evt)
                    }}>
                      Generate
                    </button>
                  </div>
                </div>
                
                <br/>
                <br/>
              </div>
            </section>
          </div>
        </div>
    );
  }
}

export default Pin;
