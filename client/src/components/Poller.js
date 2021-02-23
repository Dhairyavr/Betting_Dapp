//import logo from './logo.svg';
//import './App.css';

//import freelance from "./../../abis/freelance.json";
import React, { Component } from "react";

import Web3 from "web3";
import { BrowserRouter as Router } from "react-router-dom";



//import "../../public/css/nivo-lightbox/nivo-lightbox.css";
//import "../../public/css/nivo-lightbox/default.css";
//import "../../public/fonts/font-awesome/css/font-awesome.css";
//import "../../public/css/style.css";
//import "bootstrap/dist/css/bootstrap.css";

import "./App.css";

class Poller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      landingPageData: {},
    };
  }
 

  render() {
    return (
      <div>
      Hello Poller
      </div>
    );
  }
}

export default Poller;
