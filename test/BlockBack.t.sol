// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {BlockBack} from "../src/BlockBack.sol";

contract BlockBackTest is Test, BlockBack {
    BlockBack blockbackContract;

    address public USER = makeAddr("user");
    uint256 public constant INITIAL_BALANCE = 1 ether;

    /* dummy campaign values */
    string _metadataHash = "0x0";
    uint256 _minAmount = 0.1 ether;
    uint256 _maxAmount = 10 ether;
    uint256 _goal = 30 ether;
    uint256 _deadline = 1000000000;

    function setUp() public {
        blockbackContract = new BlockBack();
        vm.deal(USER, INITIAL_BALANCE);
    }

    function testCampaignCreation() public {
        vm.prank(USER);
        vm.recordLogs();

        /** @dev cannot test the ID (first indexed value) as it is randomly generated
        in the function itself, at test time we don't know the value */
        vm.expectEmit(false, true, false, false);
        emit NewCampaign(
            0,
            USER,
            Campaign(
                CampaignStatus.Active,
                _metadataHash,
                _deadline,
                GoalDetails(_minAmount, _maxAmount, _goal),
                USER
            )
        );
        blockbackContract.createCampaign(
            _metadataHash,
            _minAmount,
            _maxAmount,
            _goal,
            _deadline
        );

        /** @dev A bit of confusion with log entries here,
         * the first log entry is the even from this testing contract
         * and the second log entry is from the BlockBack contract
         */
        Vm.Log[] memory entries = vm.getRecordedLogs();

        assertEq(entries.length, 2);
        assertEq(entries[0].topics.length, 4);

        /** get id of the new campaign */
        uint256 newCampaignId = uint256(entries[1].topics[1]);

        /** Get campaign from mapping and test against correct owner */
        Campaign memory campaign = blockbackContract.getCampaign(newCampaignId);
        assertEq(campaign.owner, USER);

        /** Get all campaigns and test against the length */
        Campaign[] memory campaigns = blockbackContract.getAllCampaigns();
        assertEq(campaigns.length, 1);
    }
}
