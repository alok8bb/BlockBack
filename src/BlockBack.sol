// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/console.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BlockBack is Ownable {
    enum CampaignStatus {
        Active,
        Completed
    }

    struct GoalDetails {
        uint256 minAmount;
        uint256 maxAmount;
        uint256 goal;
    }

    struct Campaign {
        uint256 id;
        CampaignStatus status;
        string metadataHash;
        uint256 deadline;
        GoalDetails goalDetails;
        uint256 raisedAmount;
        address owner;
    }

    uint256 private campaignCounter;

    mapping(uint256 => Campaign) private s_idToCampaign;
    mapping(address => uint256[]) private s_ownerToCampaignIds;
    Campaign[] private s_campaigns;

    receive() external payable {}

    error BlockBack__CampaignInactive();
    error BlockBack__CampaignExpired();
    error BlockBack__AmountLessThanMinAmount();
    error BlockBack__AmountMoreThanMaxAmount();
    error BlockBack__OnlyOwnerCanWithdraw();
    error BlockBack__DeadlineNotMet();

    event NewCampaign(
        uint256 indexed id,
        address indexed owner,
        Campaign indexed campaign
    );

    event DonationSuccess(
        uint256 indexed campaignId,
        uint256 indexed amount,
        address indexed donator
    );

    event CampaignWithrawn(uint256 indexed campaignId, address indexed owner);

    constructor() {
        campaignCounter = 0;
    }

    function createCampaign(
        string memory _metadataHash,
        uint256 _minAmount,
        uint256 _maxAmount,
        uint256 _goal,
        uint256 _deadline
    ) external {
        Campaign memory campaign = Campaign({
            id: campaignCounter,
            status: CampaignStatus.Active,
            metadataHash: _metadataHash,
            deadline: _deadline,
            goalDetails: GoalDetails({
                minAmount: _minAmount,
                maxAmount: _maxAmount,
                goal: _goal
            }),
            raisedAmount: 0 ether,
            owner: msg.sender
        });

        s_idToCampaign[campaignCounter] = campaign;
        s_ownerToCampaignIds[msg.sender].push(campaignCounter);
        s_campaigns.push(campaign);

        emit NewCampaign(campaignCounter, msg.sender, campaign);
        campaignCounter++;
    }

    function contribute(uint256 _id) external payable {
        Campaign storage campaign = s_idToCampaign[_id];
        if (campaign.status != CampaignStatus.Active) {
            revert BlockBack__CampaignInactive();
        }

        if (block.timestamp > campaign.deadline) {
            revert BlockBack__CampaignExpired();
        }

        if (msg.value < campaign.goalDetails.minAmount) {
            revert BlockBack__AmountLessThanMinAmount();
        }

        if (msg.value > campaign.goalDetails.maxAmount) {
            revert BlockBack__AmountMoreThanMaxAmount();
        }

        emit DonationSuccess(_id, msg.value, msg.sender);
        campaign.raisedAmount += msg.value;
        s_campaigns[_id] = campaign;
    }

    function withdrawCampaign(uint256 _id) external payable {
        Campaign storage campaign = s_idToCampaign[_id];
        if (campaign.owner != msg.sender) {
            revert BlockBack__OnlyOwnerCanWithdraw();
        }

        if (campaign.deadline > block.timestamp) {
            revert BlockBack__DeadlineNotMet();
        }

        campaign.status = CampaignStatus.Completed;
        s_campaigns[_id] = campaign;

        payable(msg.sender).transfer(campaign.raisedAmount);
        emit CampaignWithrawn(_id, msg.sender);
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getCampaign(uint256 _id) external view returns (Campaign memory) {
        return s_idToCampaign[_id];
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        return s_campaigns;
    }

    function getCampaignsByCreator() external view returns (Campaign[] memory) {
        uint256[] memory campaignIds = s_ownerToCampaignIds[msg.sender];
        Campaign[] memory campaigns = new Campaign[](campaignIds.length);

        for (uint256 i = 0; i < campaignIds.length; i++) {
            campaigns[i] = s_idToCampaign[campaignIds[i]];
        }

        return campaigns;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
