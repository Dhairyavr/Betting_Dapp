//import logo from './logo.svg';
//import './App.css';

//import freelance from "./../../abis/freelance.json";
//import Betting from "../abis/Betting.json";
import React, { Component } from "react";
import { Card, Icon, Image,Segment,Button,Header,Form,Checkbox,Input,Dimmer,Loader} from 'semantic-ui-react';

import { BrowserRouter as Router } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import token from '../token';
import axios from 'axios';
import { SportmonksApi } from 'sportmonks-api';


//import "../../public/css/nivo-lightbox/nivo-lightbox.css";
//import "../../public/css/nivo-lightbox/default.css";
//import "../../public/fonts/font-awesome/css/font-awesome.css";
//import "../../public/css/style.css";
//import "bootstrap/dist/css/bootstrap.css";

import "./App.css";
import Web3 from 'web3';
class Poller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      enableform:false,
      matchid:"",
      teams:"",
      message:"",
      currentmatchdata:[],
      display:[],//[{matchid,team1id,team2id,stadium}]
      display2:[],
      betting:null,
      temp:0,
      name:"",
      name2:"",
      stadium:""
    };
    //this.retutr= this.retutr.bind(this);
  }

  async componentDidMount()
  {
    await this.loadWeb3();
    await this.loadCricketandBlockchainData();
    //this.filtercurrentmatchdata();
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

  handleform(matchid,team1,team2)
  {
      console.log(matchid);
      console.log("form me",this.state.currentmatchdata);
      var str=team1+" vs. "+team2;
      this.setState({teams:str});
      this.setState({matchid});
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
    //const networkdata=Betting.networks[networkId];
    /*if(networkdata)
    {
      const betting=new web3.eth.Contract(Betting.abi,networkdata.address);
      //console.log(piratescatcher);
      this.setState({betting});
    }*/

   // console.log(token);
  /* const sportmonks=new SportmonksApi(token);
   sportmonks.get(`https://cricket.sportmonks.com/api/v2.0/fixtures?api_token=${token}`).then( function(resp){
     console.log(resp);
    } );*/
var config = {
  method: 'get',
  url: `https://cricket.sportmonks.com/api/v2.0/fixtures?api_token=${token}`,
  headers: {  }
};

//var currentmatchdata;

axios(config)
//console.log("result",response);
.then((response)=> {
  //console.log("response",response.data);
  //this.setState({currentmatchdata:response.data});
  //console.log("currmatchdata",this.state.currentmatchdata);
  
  //currentmatchdata=response.data;
  //console.log(JSON.stringify(response.data));
  return response.data.data;
})
.then(async (data)=>{
  console.log("data mila",data);
 var len=data.length;
 console.log("len=",len);
  for(var i=0;i<len;i++)
  {
    console.log("i=",i);
  var localteamid=data[i].localteam_id;
  var visitorteamid=data[i].visitorteam_id;
  var stadiumid=data[i].venue_id;
  var matchid=data[i].id;
  var obj=new Object();
  obj.matchid=matchid;
  obj.team1id=localteamid;
  obj.team2id=visitorteamid;
  obj.stadium=stadiumid;

  await this.getteamname1(obj.team1id);
  await this.getteamname2(obj.team2id);
  await this.getstadiumname(obj.stadium);
  /*var config2 = {
    method: 'get',
    url: `https://cricket.sportmonks.com/api/v2.0/teams/${obj.team1id}?api_token=${token}`,
    headers: {  }
  };
  axios(config2,{
    params: {
      obj:obj
    }
  })
  .then((response)=>{
    console.log("object inside=",obj);
    obj.team1id=response.data.data.name;
    console.log("object after=",obj);
  });*/
  /*
  var config3 = {
    method: 'get',
    url: `https://cricket.sportmonks.com/api/v2.0/teams/${visitorteamid}?api_token=${token}`,
    headers: {  }
  };
  axios(config3)
  .then((response)=>{
    obj.team2id=response.data.name;
  });
  var config4 = {
    method: 'get',
    url: `https://cricket.sportmonks.com/api/v2.0/venues/${stadiumid}?api_token=${token}`,
    headers: {  }
  };
  axios(config4)
  .then((response)=>{
    obj.stadium=response.data.name;
  });*/
  obj.team1name=this.state.name1;
  obj.team2name=this.state.name2;
  obj.stadiumname=this.state.stadium;
  console.log("Object=",obj);
  var arr=this.state.display;
arr.push(obj);
this.setState({display:arr});

}
this.setState({display2:this.state.display});
console.log("display",this.state.display);

//console.log("name=",this.state.name);
  //axios(config2).then((response)


  

})
.catch(function (error) {
  console.log(error);
});



//var delayInMilliseconds = 3000; //1 second

//var status=this.state.isFetching



    
    
  }

  /*filtercurrentmatchdata()
  {
     var currmatchdata=this.state.currentmatchdata;
     console.log(currmatchdata);
  }*/
  componentDidUpdate(prevProps, prevState) {
    /*console.log("didupdate",
      this.state.currentmatchdata
    );*/
    console.log("name:",this.state.name);
    //console.log("display",this.state.display);


  }

  retutr(i)
  {
    var k=i+1;
    this.setState({temp:k});
    return k;
  }

  async getteamname1(teamid)
  {
    //var global;
    var config2 = {
      method: 'get',
      url: `https://cricket.sportmonks.com/api/v2.0/teams/${teamid}?api_token=${token}`,
      headers: {  }
    };
    await axios(config2)
    .then((response)=>{
      //console.log(response);
      //global=response.data.data.name;
      this.setState({name1:response.data.data.name});
    });

    

    //console.log("global=",global);
  }

  async getteamname2(teamid)
  {
    //var global;
    var config2 = {
      method: 'get',
      url: `https://cricket.sportmonks.com/api/v2.0/teams/${teamid}?api_token=${token}`,
      headers: {  }
    };
    await axios(config2)
    .then((response)=>{
      //console.log(response);
      //global=response.data.data.name;
      this.setState({name2:response.data.data.name});
    });

    

    //console.log("global=",global);
  }

  async getstadiumname(stadiumid)
  {
    //var global;
    var config2 = {
      method: 'get',
      url: `https://cricket.sportmonks.com/api/v2.0/venues/${stadiumid}?api_token=${token}`,
      headers: {  }
    };
    await axios(config2)
    .then((response)=>{
      //console.log(response);
      //global=response.data.data.name;
      this.setState({stadium:response.data.data.name});
    });

    

    //console.log("global=",global);
  }

  

  

 /* handleClick(matchid)
  {
    console.log(ind);
      alert(ind);
  }*/

  handleSubmit=async(event)=>
  {
    event.preventDefault();
    var question=this.state.message;
    var str=this.state.teams.split(" vs. ");
    const web3=window.web3;
    var matchid=this.state.matchid;
    console.log("question",question);
    console.log("str",str);
    //api call to sportmonks to get team ids from match id
    //get two team ids
    //append to each str[0] and str[1]
    console.log("matchid",matchid);
    await this.state.betting.methods().registerpoll((this.state.message).toString(),str,this.state.matchid).send({from:this.state.account});
  }
 

  render() {

    return (
      <div>
        <Segment inverted color="black">
        <Header as='h2' icon textAlign='center'>
      <Icon name='users' circular />
      <Header.Content>Make a Poll</Header.Content>
    </Header>
    <br/>
    <Header as='h2' icon textAlign='center'>
      <Header.Content>Upcoming Matches</Header.Content>
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
                      src='https://webstockreview.net/images/cricket-clipart-cricket-symbol-1.jpg'
                    />
                    <Card.Header>{d.team1name} vs. {d.team2name}</Card.Header>
                    <Card.Meta>T20 - {d.matchid}</Card.Meta>
                    <Card.Description>
                      {d.stadiumname}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div className='ui two buttons'>
                      <Button color='green' onClick={()=>this.handleform(d.matchid,d.team1name,d.team2name)}>
                        Make Poll
                      </Button>
                      
                    </div>
                  </Card.Content>
                </Card>
                ))
              :( 
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
      <Header.Content>Register your poll</Header.Content>
    </Header>
    <Form>
    <Form.Field >
      <Input fluid label = "Match ID"
      ref = {
        (input) => {
          this.matchid = input;
        }
      }
      value = {
        this.state.matchid
      }
      onChange = {
        event => this.setState({
          matchid: event.target.value
        })
      }
      disabled
      />
      </Form.Field>
      <br/>
      <Form.Field >
      <Input fluid label = "Message"
      ref = {
        (input) => {
          this.message = input;
        }
      }
      value = {
        this.state.message
      }
      onChange = {
        event => this.setState({
          message: event.target.value
        })
      }
      />
      </Form.Field>
      <br/>
      <Form.Field >
      <Input fluid label = "Teams"
      ref = {
        (input) => {
          this.teams = input;
        }
      }
      value = {
        this.state.teams
      }
      onChange = {
        event => this.setState({
          teams: event.target.value
        })
      }
      disabled
      />
      </Form.Field>
      
    
    <Button type='submit' color="blue" onClick={this.handleSubmit}>Register</Button>
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

export default Poller;
