import React,{Component} from 'react';
import "./Footer.css";


class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <div>
            <div class="col-md-12 text-center">
            <p>
  Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved |  <i class="icon-heart" aria-hidden="true"></i> by 
  </p>
          </div>
        </div> );
    }
}
 
export default Footer;