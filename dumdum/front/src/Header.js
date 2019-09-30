import React,{Component} from 'react';
import {  NavLink,Link } from "react-router-dom";
import EcommercePage from '../src/components/Cards/cards.js'


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
        <div>
          <NavLink to="/admin/file">upload</NavLink>
          <br/><br/>
          <NavLink to="/admin/cards">cards</NavLink>
          <br/><br/>
          <NavLink to="/admin/studentpin">studentspin</NavLink>
          <br/><br/>
          <NavLink to="/admin/professorpin">
            profPin
          </NavLink>
        
        </div>
    );
  }
}

export default Header;

