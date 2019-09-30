import React from "react";
import { Link } from "react-router-dom";
import book from "../../assets/images/book.png";
import "../../assets/css/index.css";

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Links: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:8080/file")
      .then(response => response.json())
      .then(Links => {
        console.log(Links);
        this.setState({ Links: Links.results });
      });
  }

  render() {
    return (
      <div className="icon-img">
        {this.state.Links.map((item, index) => {
          return (
            <a key={index} href={`localhost:8080/docs/${item.file_path}/${item.file_name}/index.html?pin=${this.props.pin}`}>
              <img src={book} alt="something" />
            </a>
          );
        })}
      </div>
    );
  }
}

export default Books;
