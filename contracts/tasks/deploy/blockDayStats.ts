import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { BlockDayStats, BlockDayStats__factory } from "../../typechain";

task("deploy:BlockDayStats")
  .setAction(async function(taskArguments: TaskArguments, { ethers }) {
    const BlockDayStatsFactory: BlockDayStats__factory = await ethers.getContractFactory("BlockDayStats");
    const BlockDayStats: BlockDayStats = <BlockDayStats>await BlockDayStatsFactory.deploy();
    await BlockDayStats.deployed();
    console.log("BlockDayStats deployed to: ", BlockDayStats.address);
  });
