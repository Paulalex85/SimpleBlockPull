const BlockDayStats = artifacts.require("BlockDayStats");

module.exports = function(deployer) {
  deployer.deploy(BlockDayStats);
};
