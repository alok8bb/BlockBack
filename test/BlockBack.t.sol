// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {BlockBack} from "../src/BlockBack.sol";

contract BlockBackTest is Test, BlockBack {
    BlockBack blockbackContract;

    address public OWNER = address(this);
    address public USER = makeAddr("user");
    address public DONATOR = makeAddr("donator");
    uint256 public constant INITIAL_BALANCE = 100 ether;

    /* dummy campaign values */
    string _metadataHash = "0x0";
    uint256 _minAmount = 0.1 ether;
    uint256 _maxAmount = 10 ether;
    uint256 _goal = 30 ether;
    uint256 _deadline = 1000000000;

    function setUp() public {
        blockbackContract = new BlockBack();
        vm.deal(USER, INITIAL_BALANCE);
        vm.deal(DONATOR, INITIAL_BALANCE);
    }

    function testCampaignCreation() public {
        vm.prank(USER);
        vm.recordLogs();

        /** @dev cannot test the ID (first indexed value) as it is randomly generated
        in the function itself, at test time we don't know the value */
        vm.expectEmit(true, true, false, false);
        emit NewCampaign(
            0,
            USER,
            Campaign(
                0,
                CampaignStatus.Active,
                _metadataHash,
                _deadline,
                GoalDetails(_minAmount, _maxAmount, _goal),
                0,
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
        assertEq(entries[1].topics.length, 4);

        /** get id of the new campaign */
        uint256 newCampaignId = uint256(entries[1].topics[1]);

        /** Get campaign from mapping and test against correct owner */
        Campaign memory campaign = blockbackContract.getCampaign(newCampaignId);
        assertEq(campaign.owner, USER);

        /** Get all campaigns and test against the length */
        Campaign[] memory campaigns = blockbackContract.getAllCampaigns();
        assertEq(campaigns.length, 1);
    }

    /* Helper function to create a test campaign */
    function createTestCampaign() public returns (uint256) {
        vm.prank(USER);
        vm.recordLogs();
        vm.expectEmit(true, true, false, false);
        emit NewCampaign(
            0,
            USER,
            Campaign(
                0,
                CampaignStatus.Active,
                _metadataHash,
                _deadline,
                GoalDetails(_minAmount, _maxAmount, _goal),
                0,
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

        Vm.Log[] memory entries = vm.getRecordedLogs();
        assertEq(entries.length, 2);
        assertEq(entries[0].topics.length, 4);
        assertEq(entries[1].topics.length, 4);
        uint256 newCampaignId = uint256(entries[1].topics[1]);

        return newCampaignId;
    }

    function testContribute() public {
        uint256 campaignId = createTestCampaign();
        vm.prank(DONATOR);
        vm.recordLogs();

        vm.expectEmit(true, true, true, false);
        emit DonationSuccess(campaignId, 0.2 ether, DONATOR);

        (bool callSuccess, ) = address(blockbackContract).call{
            value: 0.2 ether
        }(abi.encodeWithSignature("contribute(uint256)", campaignId));
        assertEq(callSuccess, true);

        Vm.Log[] memory entries = vm.getRecordedLogs();
        /* Check if the correct event logs are emitted */
        assertEq(entries.length, 2);
        assertEq(entries[0].topics.length, 4);
        assertEq(entries[1].topics.length, 4);

        /* Check if the donator is correct */
        address donator = address(uint160(uint256(entries[1].topics[3])));
        assertEq(donator, DONATOR);

        /* Check if the balance of the contract is updated */
        assertEq(address(blockbackContract).balance, 0.2 ether);

        /* Check if the raised amount of the campaign is updated */
        Campaign memory campaign = blockbackContract.getCampaign(campaignId);
        assertEq(campaign.raisedAmount, 0.2 ether);
    }

    function testRevertOnDonationLessThanMin() public {
        uint256 campaignId = createTestCampaign();
        vm.prank(USER);

        vm.expectRevert(BlockBack.BlockBack__AmountLessThanMinAmount.selector);
        (bool revertsAsExpected, ) = address(blockbackContract).call{
            value: 0.03 ether
        }(abi.encodeWithSignature("contribute(uint256)", campaignId));
        assertTrue(revertsAsExpected);
    }

    function testRevertOnDonationMoreThanMax() public {
        uint256 campaignId = createTestCampaign();
        vm.prank(USER);

        vm.expectRevert(BlockBack.BlockBack__AmountMoreThanMaxAmount.selector);
        (bool revertsAsExpected, ) = address(blockbackContract).call{
            value: 11 ether
        }(abi.encodeWithSignature("contribute(uint256)", campaignId));
        assertTrue(revertsAsExpected);
    }

    function donationMaker(uint256 campaignId) public payable {
        vm.prank(DONATOR);
        bool res = false;

        /* Complete goal of the campaign */
        (res, ) = address(blockbackContract).call{value: 10 ether}(
            abi.encodeWithSignature("contribute(uint256)", campaignId)
        );

        (res, ) = address(blockbackContract).call{value: 10 ether}(
            abi.encodeWithSignature("contribute(uint256)", campaignId)
        );

        (res, ) = address(blockbackContract).call{value: 10 ether}(
            abi.encodeWithSignature("contribute(uint256)", campaignId)
        );
    }

    // function testStatusCompletedAfterGoalReached() public {
    //     uint256 campaignId = createTestCampaign();
    //     donationMaker(campaignId);
    //     Campaign memory campaign = blockbackContract.getCampaign(campaignId);
    //     assertEq(
    //         uint(campaign.status),
    //         uint(BlockBack.CampaignStatus.Completed)
    //     );
    // }

    // function testRevertOnContributeIfCampaignNotActive() public {
    //     uint256 campaignId = createTestCampaign();
    //     donationMaker(campaignId);

    //     /* Make another donation after the campaign is completed */
    //     vm.expectRevert(BlockBack.BlockBack__CampaignInactive.selector);
    //     (bool revertsAsExpected, ) = address(blockbackContract).call{
    //         value: 10 ether
    //     }(abi.encodeWithSignature("contribute(uint256)", campaignId));

    //     assertTrue(revertsAsExpected);
    // }

    function testRevertOnContributeAfterDeadline() public {
        uint256 campaignId = createTestCampaign();
        Campaign memory campaign = blockbackContract.getCampaign(campaignId);

        /* Skip to the deadline of the campaign */
        skip(campaign.deadline + 1000);
        vm.expectRevert(BlockBack.BlockBack__CampaignExpired.selector);
        (bool revertsAsExpected, ) = address(blockbackContract).call{
            value: 0.1 ether
        }(abi.encodeWithSignature("contribute(uint256)", campaignId));

        assertTrue(revertsAsExpected);
    }

    function testReceiveEther() public {
        payable(address(blockbackContract)).transfer(1 ether);

        assertEq(blockbackContract.getBalance(), 1 ether);
    }

    function testFundWithdrawByOwner() public {
        payable(address(blockbackContract)).transfer(1 ether);
        vm.prank(OWNER);
        vm.recordLogs();
        (bool success, ) = address(blockbackContract).call(
            abi.encodeWithSignature("withdraw()")
        );

        assertTrue(success);
        assertEq(address(blockbackContract).balance, 0);
    }

    function testFailFundWithdrawByNonOwner() public {
        payable(address(blockbackContract)).transfer(1 ether);
        vm.prank(USER);
        vm.recordLogs();
        (bool success, ) = address(blockbackContract).call(
            abi.encodeWithSignature("withdraw()")
        );

        assertTrue(success);
        assertEq(address(blockbackContract).balance, 0);
    }

    function testCampaignArrayUpdateOnContribution() public {
        uint256 campaignId = createTestCampaign();
        donationMaker(campaignId);

        Campaign[] memory campaigns = blockbackContract.getAllCampaigns();
        assertEq(campaigns[0].raisedAmount, 30 ether);
    }

    function testCampaignWithdraw() public {
        uint256 campaignId = createTestCampaign();
        donationMaker(campaignId);
        uint256 balance = USER.balance;
        Campaign memory c = blockbackContract.getCampaign(campaignId);

        skip(c.deadline + 3000);
        vm.prank(USER);
        (bool success, ) = address(blockbackContract).call(
            abi.encodeWithSignature("withdrawCampaign(uint256)", campaignId)
        );
        assertTrue(success);
        Campaign memory campaign = blockbackContract.getCampaign(campaignId);
        assert(campaign.status == CampaignStatus.Completed);
        assert(USER.balance - balance == 30 ether);
    }

    function testFailCampaignWithdrawBeforeDeadline() public {
        uint256 campaignId = createTestCampaign();
        donationMaker(campaignId);

        vm.expectRevert(BlockBack.BlockBack__DeadlineNotMet.selector);
        (bool success, ) = address(blockbackContract).call(
            abi.encodeWithSignature("withdrawCampaign(uint256)", campaignId)
        );

        assertTrue(success);
    }
}
