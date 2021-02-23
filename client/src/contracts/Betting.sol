// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol";
contract Betting is ChainlinkClient
{
     uint256 public winner_id;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
 
    constructor() public {
        setPublicChainlinkToken();
        oracle = 0x56dd6586DB0D08c6Ce7B2f2805af28616E082455;
        jobId = "b6602d14e4734c49a5e1ce19d45a4632";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }
    
    
    struct Poll
    {
        uint pollid;
        string question; // poll ka question
        string[] options; // poll ke options
        bool flag; // poll chalu rakhna hai ya nahi?
        mapping(address=>uint) betoption; // better ka bet option
        mapping(address=>bool) entries; // better ka previous existence
        address[] betters; // list of betters
        address pollowner;// poll owner
        mapping(address=>uint) betamt;// bet ka amount
        uint matchid;
        uint winnerid;
    }  
    
    //Mote:-
    // Polls ka indexing will start from 0 because pollcounter start from 0
    //Options ka indexing will start from 0
    
    uint public pollcounter=0; // sab poll ka counter
    
    mapping(uint=>Poll) public allpolls;
    
    event PollRegistered(uint pollid,string question,bool flag);
    
    
    
  
    function getwinner(uint pollid)public view returns(uint)
    {
       return allpolls[pollid].winnerid; 
    }
    
    
    function requestVolumeData(string memory match_id) public returns (bytes32 requestId) 
    {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("get", 
        string(abi.encodePacked("https://cricket.sportmonks.com/api/v2.0/fixtures/",match_id,"?api_token=dElBVcftKTVCDpKHGNijsMtnKMW7GmGLT2sdmJQw0pWZ3H92COVoCed0ySiK"))
        );
        
        req.add("path", "data.winner_team_id");
        //req.add("path", "data.id");
        
       // string memory idpoll=uint2str(pollid);
        //req.add("pollid",string(abi.encodePacked(pollid)));
    
        // Sends the request
        return sendChainlinkRequestTo(oracle, req, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
     //string public temppollid;
    function fulfill(bytes32 _requestId, uint256 winner_team_id) public recordChainlinkFulfillment(_requestId)
    {
        winner_id= winner_team_id;
        //uint pollidentity=stringToUint(pollid);
        //temppollid=pollid;
        //allpolls[pollid].winnerid=winner_id;
    }
    
    
    
    function registerpoll(string memory question,string[] memory options,uint _matchid) public
    {
        Poll memory p;
        p.pollid=pollcounter;
        p.question=question;
        p.options=options;
        p.flag=true;
        p.pollowner=msg.sender;
        p.matchid=_matchid;
        allpolls[pollcounter]=p;
        pollcounter++;
        emit PollRegistered(p.pollid,p.question,p.flag);
    }
    
    function closepoll(uint pollid)public
    {
        require(pollid<pollcounter);
        allpolls[pollid].flag=false;
        allpolls[pollid].winnerid=winner_id;
        winner_id=0;
    }
    
    function getoptionofaddress(uint pollid,address better)public view returns(uint)//kaunse poll me kis better ne kya option liya tha voh yaha se milega
    {
        require(pollid<pollcounter);
        require(allpolls[pollid].pollowner==msg.sender);// poll owner can only which better cose which option
        require(allpolls[pollid].entries[better]==true);//better ne bet kiya hai ki nai vo check karna padega
        return allpolls[pollid].betoption[better];
    }
    
    function makebet(uint pollid,uint option,uint betamount)public
    {
        address better=msg.sender;
        require(pollid<pollcounter);//pollcounter se chhota hona chahiye
        require(allpolls[pollid].flag==true);//bet karne ke liye poll chalu rehna jaruri hai
        require(allpolls[pollid].pollowner!=better); // owner khud bet nahi kar sakta apne poll pe
        require(allpolls[pollid].entries[better]==false); // do baar bet mat karna. allowed nahi hai
        require(option>=0 && option<allpolls[pollid].options.length); // jitna option diya hai usme se hi enter karna jyada dimag mat lagao
        require(betamount<=1);
        allpolls[pollid].entries[better]=true;
        allpolls[pollid].betoption[better]=option;
        allpolls[pollid].betters.push(better);
        allpolls[pollid].betamt[better]=betamount;
    }
    
    function getpolloptions(uint pollid) public view returns(string[] memory)
    {
        require(pollid<pollcounter);
        return allpolls[pollid].options;
    }
    
    function getparticipants(uint pollid) public view returns(address[] memory)
    {
        require(pollid<pollcounter);
        require(allpolls[pollid].pollowner==msg.sender);// poll owner ko hi sab participant list dekhne milega
        return allpolls[pollid].betters;//will calculate winners in javascript
    }
   
}