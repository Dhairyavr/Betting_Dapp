var Betting = artifacts.require("../src/contracts/Betting.sol");

module.exports = function(deployer) {
  deployer.deploy(Betting).then(function() {
    
  });
};
