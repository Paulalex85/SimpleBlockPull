import { expect } from "chai";
import { BigNumber } from "ethers";

export function shouldSaveDailyStats(): void {
  it("should save daily stats", async function() {
    const dayAdded = "11/10/2021";
    let stat = await this.blockDayStats.connect(this.signers.admin).getStat(dayAdded);
    expect(stat.totalGasFees).to.equal(BigNumber.from(0));
    expect(stat.numberBlocks).to.equal(BigNumber.from(0));

    const gasValue = 124567889;
    const nbBlocks = 45;
    await this.blockDayStats.addDailyStat(dayAdded, BigNumber.from(gasValue), BigNumber.from(nbBlocks));
    stat = await this.blockDayStats.connect(this.signers.admin).getStat(dayAdded);
    expect(stat.totalGasFees).to.equal(BigNumber.from(gasValue));
    expect(stat.numberBlocks).to.equal(BigNumber.from(nbBlocks));
  });
}
