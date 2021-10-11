import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { BlockDayStats } from "../../typechain";
import { Signers } from "../types";
import { shouldSaveDailyStats } from "./BlockDayStats.behavior";

const { deployContract } = hre.waffle;

describe("Unit tests", function() {
  before(async function() {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("Daily Stats", function() {
    beforeEach(async function() {
      const blockDayStatsArtifact: Artifact = await hre.artifacts.readArtifact("BlockDayStats");
      this.blockDayStats = <BlockDayStats>await deployContract(this.signers.admin, blockDayStatsArtifact);
    });

    shouldSaveDailyStats();
  });
});
