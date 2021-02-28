//import logo from './logo.svg';
//import './App.css';

//import freelance from "./../../abis/freelance.json";
//import Betting from "../abis/Betting.json";
import React, { Component } from "react";
import { Card, Icon, Image,Segment,Button,Header,Form,Checkbox,Input ,Loader} from 'semantic-ui-react';

import { BrowserRouter as Router } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';


//import "../../public/css/nivo-lightbox/nivo-lightbox.css";
//import "../../public/css/nivo-lightbox/default.css";
//import "../../public/fonts/font-awesome/css/font-awesome.css";
//import "../../public/css/style.css";
//import "bootstrap/dist/css/bootstrap.css";

import "./App.css";
import Web3 from 'web3';
class Better extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      enableform:false,
      pollid:"",
      team1:"India",
      team2:"England",
      option:"",
      betamount:"",
      value:"",
      display:[],
      display2:[],
      betting:null
    };
  }

  async componentDidMount()
  {
    await this.loadWeb3();
    await this.loadCricketandBlockchainData();
  }

  async loadWeb3()
  {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        console.log(window.web3);
        //console.log(web3.eth.getAccounts());
        // Acccounts now exposed
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      console.log(window.web3);
      // Acccounts always exposed
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async handleform(pollid,team1,team2)
  {
      console.log(pollid);
      this.setState({pollid});
      this.setState({team1});
      this.setState({team2});
      
      /*var pollvalues=await this.state.betting.methods().getpolldetails(pollid).call();
      var pollmatchid=pollvalues[1];
      var pollquestion=pollvalues[0];
      var polloptions=await this.state.betting.methods().getpolloptions(pollid).call();
      var op1=polloptions[0];
      var op2=polloptions[1];
      var disoption1=op1.substring(op1.indexOf("$")+1,op1.length);
      var disoption2=op2.substring(op2.indexOf("$")+1,op2.length);
      this.setState({team1:disoption1,team2:disoption2});*/
      //var str=team1+" vs. "+team2;
      //this.setState({teams:str});
      //this.setState({matchid});
      this.setState({enableform:true});
  }

  
  async loadCricketandBlockchainData()
  {
    const web3=window.web3;
    const accounts=await web3.eth.getAccounts();
    //var paccount = accounts[0];
    //var oldaccount=this.state.account;
    this.setState({account:accounts[0]});
    window.ethereum.on('accountsChanged', function (accounts) {
      // Time to reload your interface with accounts[0]!
      alert("Account changed");
      this.setState({account:accounts[0]});
    }.bind(this));

    console.log(web3);
    console.log(accounts);
   // 
   const networkId=await web3.eth.net.getId();
    

    /*const networkdata=Betting.networks[networkId];
    if(networkdata)
    {
      const betting=new web3.eth.Contract(Betting.abi,networkdata.address);
      //console.log(piratescatcher);
      this.setState({betting});
      var counter=await this.state.betting.methods().pollcounter().call();
      for(var i=0;i<counter;i++)
      {
        var pollstatus=await this.state.betting.methods().getpollstatus(i).call();
        if(pollstatus==true)
        {
        var obj=new Object();
          obj.pollid=i;
          var polloptions=await this.state.betting.methods().getpolloptions(i).call();
          obj.team1=polloptions[0];
          obj.team2=polloptions[1];
          var polldetails=await this.state.betting.methods().getpolldetails(i).call();
          obj.question=polldetails[0];
          obj.matchid=polldetails[1];
          var arr=this.state.display;
          arr.push(obj);
          this.setState({display:arr});
        }
      }
      this.setState({display2:this.state.display});
      
    }*/

    
    
  }
  

  

 /* handleClick(matchid)
  {
    console.log(ind);
      alert(ind);
  }*/

  handleChange = (e, { value }) => this.setState({ value })

  handleSubmit=async(event)=>
  {
    event.preventDefault();
    var option=this.state.value;
    var betamount=this.state.betamount;
    
    const web3=window.web3;
    
    console.log("option",option);
    console.log("betamount",betamount);
    
    //await this.state.betting.methods().makebet(this.state.pollid,this.state.option,this.state.betamount).send({from:this.state.account});
  }
 

  render() {
    return (
      <div>
        <Segment inverted color="black">
        <Header as='h2' icon textAlign='center'>
      <Icon name='hand lizard outline' circular />
      <Header.Content>Make a Bet</Header.Content>
    </Header>
    <br/>
    <Header as='h2' icon textAlign='center'>
      <Header.Content>Active Polls</Header.Content>
    </Header>
    <br/>
    <br/>
        <Card.Group>
        {this.state.display2.length!==0
              ? this.state.display2.map((d,i) => (
                <Card key={`${d.matchid}`}>
                <Card.Content>
                  <Image
                    floated='right'
                    size='mini'
                    src='https://cdn.iconscout.com/icon/premium/png-512-thumb/bet-2-1091649.png'
                  />
                  <Card.Header>{d.team1} vs. {d.team2}</Card.Header>
                  <Card.Meta>T20 - {d.matchid}</Card.Meta>
                  <Card.Description>
                    {d.question}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className='ui two buttons'>
                    <Button color='green' onClick={()=>this.handleform(d.pollid,d.team1,d.team2)}>
                      Make Bet
                    </Button>
                    
                  </div>
                </Card.Content>
              </Card>
                ))
              : ( 
                <Header as='h2' icon textAlign='center'>
                <Header.Content></Header.Content>
              </Header>)}
    
    
    
  </Card.Group>
  </Segment>
  {
              this.state.display2.length==0?( 
               <div> <Header as='h2' icon textAlign='center'>
                <Header.Content>Loading</Header.Content>
              </Header>  <Loader active inline='centered' /></div>):(<Header as='h2' icon textAlign='center'>
        <Header.Content></Header.Content>
      </Header>)
            }
      {
        this.state.enableform?(
          <div>
            <Segment inverted color="grey">
        <Header as='h2' icon textAlign='center'>
      <Header.Content>Make your Bet</Header.Content>
    </Header>
    <Form>
    <Form.Field >
      <Input fluid label = "Poll ID"
      ref = {
        (input) => {
          this.pollid = input;
        }
      }
      value = {
        this.state.pollid
      }
      onChange = {
        event => this.setState({
          pollid: event.target.value
        })
      }
      disabled
      />
      </Form.Field>
      <br/>
      <Form.Group inline>
          <label>Select Team</label>
          <Form.Radio
            label={this.state.team1}
            value={this.state.team1}
            checked={this.state.value === this.state.team1}
            onChange={this.handleChange}
          />
          <Form.Radio
            label={this.state.team2}
            value={this.state.team2}
            checked={this.state.value === this.state.team2}
            onChange={this.handleChange}
          />
         
        </Form.Group>
      <br/>
      <Form.Field >
      <Input fluid label = "Bet Amount"
      ref = {
        (input) => {
          this.betamount = input;
        }
      }
      value = {
        this.state.betamount
      }
      onChange = {
        event => this.setState({
          betamount: event.target.value
        })
      }
     
      />
      </Form.Field>
      
    
    <Button type='submit' color="blue" onClick={this.handleSubmit}>Submit</Button>
  </Form>
  </Segment>
  </div>
        ):(<Header as='h2' icon textAlign='center'>
        <Header.Content></Header.Content>
      </Header>)
      }
  
      </div>
    );
  }
}

export default Better;
