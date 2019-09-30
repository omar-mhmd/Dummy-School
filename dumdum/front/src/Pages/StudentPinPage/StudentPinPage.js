import React from 'react';
import { RandomPassword } from '../../utils/RandomPassword'
import moon from '../../assets/images/moon.png'
import sun from '../../assets/images/sun.png'
import ClipBoard from '../../components/ClipBoard/ClipBoard'
import Toggle from '../../components/Toogle'

import 'terminal.css';
import '../../assets/css/index.css';

class StudentPinPage extends React.Component {
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
      grades: [],
      selected_grade: null,
    };
  }
  componentDidMount() {
    this.generatePwd();
    fetch('http://localhost:8080/grade')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.setState({
              grades: data.results,
            })
          }
        })
        .catch(error => {
          console.log(error);
        })
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
    this.setState({pwd});
  }
  
  handleCheckbox = (e) => {
    const {name, checked} = e.target;
    this.setState({
      [name]: checked,
    });
    this.generatePwd();
  }
  
  handleRadioButton = (e) => {
    const {name, value} = e.target;
    
    debugger;
    console.log(e.target);
    this.setState({
      [name]: value,
    })
  }
  
  onSubmit = async evt => {
    if (!this.state.selected_grade) {
      alert('Please select a grade')
    } else if (this.state.pwd.length === 0) {
       this.generatePwd();
       setTimeout(()=>{
         this.onSubmit();

       }, 1000)
    } else {
      debugger;
      this.state.pwd.forEach(async pin => {
        const response = await fetch(`http://localhost:8080/student`,
            {
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
              }, body: JSON.stringify({
                pin,
                expiry_date: this.state.date,
                grade_id: this.state.selected_grade,
              }),
            });
        const answer = await response.json();
        if (answer.success) {
          alert('Student Pins Created')
          this.setState(
              {
                pwd: [],
                selected_grade: null,
              },
          )
        }
      })
      // filesArray.map((file, index) => body.append(`files[${index}]`, file))
    }
  }
  
  formatPWS = () => {
    const pwd = this.state.pwd;
    let pwd_string = '';
    pwd.map(item => {
      debugger;
      pwd_string += item + '\n';
      return item;
    })
    return pwd_string;
  }
  
  render() {
    return (
        <div className={'students-pin-page'}>
          <div className="container" style={{marginTop: 20}}>
            <section>
              <header>
                <div className="row">
                  <div className="col">
                    <h1>Select a Grade</h1>
                    <div className="grade-wrapper">
                    <select onChange={this.handleRadioButton} name='selected_grade'>
                      {this.state.grades.map((grade, index) => {
                        return (
                          <option value={grade.id}>{grade.name}</option>
                        )
                      })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <h1 className=" terminal-prompt">
                      Generate a secure password
                    </h1>
                  </div>
                  <div className="col">
                  </div>
                </div>
              </header>
              <div className="input-container">
                <textarea
                    id="input"
                    className={this.state.theme}
                    name="password"
                    readOnly
                    rows={this.state.pwd.length > 8 ? this.state.pwd.length : 8}
                    value={this.formatPWS()}
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
                  <div className="col-4">
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
                  <div className="col-8">
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
                            <input type="number" min="1" max="40" style={{width: 65}} value={this.state.count}
                                   onChange={e => {
                                     this.setState({count: e.target.value});
                                   }}
                            />
                          </div>
                          <div className="col" style={{display: 'grid', gridTemplateColumns: 'auto auto'}}>
                            <label htmlFor="email">Expiry Date: &nbsp;&nbsp;</label>
                            <input type="date" min={new Date().toISOString().split('T')[0]} value={this.state.date}
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
                    <button className="btn  btn-green" onClick={this.onSubmit}>
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
    )
  }
}

export default StudentPinPage;
