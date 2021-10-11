// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockDayStats is Ownable {
    struct DailyStats {
        uint totalGasFees;
        uint numberBlocks;
    }

    mapping(string => DailyStats) public stats;

    function addDailyStat(string memory day, uint gasFees, uint nbBlocks) public onlyOwner {
        DailyStats memory dailyStat = DailyStats({
        totalGasFees : gasFees,
        numberBlocks : nbBlocks
        });
        stats[day] = dailyStat;
    }

    function getStat(string memory day)
    external
    view
    returns (
        uint totalGasFees,
        uint numberBlocks
    ) {
        DailyStats storage dailyStat = stats[day];
        totalGasFees = dailyStat.totalGasFees;
        numberBlocks = dailyStat.numberBlocks;
    }
}
