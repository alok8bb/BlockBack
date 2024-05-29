// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/console.sol";

contract BlockBack {
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
        CampaignStatus status;
        string metadataHash;
        uint256 deadline;
        GoalDetails goalDetails;
        uint256 raisedAmount;
        address owner;
    }

    uint256 private _nonce;

    mapping(uint256 => Campaign) private s_idToCampaign;
    mapping(address => Campaign[]) private s_ownerToCampaigns;
    Campaign[] private s_campaigns;

    error BlockBack__CampaignInactive();
    error BlockBack__CampaignExpired();
    error BlockBack__AmountLessThanMinAmount();
    error BlockBack__AmountMoreThanMaxAmount();

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

    constructor() {
        _nonce = 0;
    }

    function createCampaign(
        string memory _metadataHash,
        uint256 _minAmount,
        uint256 _maxAmount,
        uint256 _goal,
        uint256 _deadline
    ) external returns (uint256) {
        uint256 id = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    _nonce
                )
            )
        );
        _nonce++;

        Campaign memory campaign = Campaign({
            status: CampaignStatus.Active,
            metadataHash: _metadataHash,
            deadline: _deadline,
            goalDetails: GoalDetails({
                minAmount: _minAmount,
                maxAmount: _maxAmount,
                goal: _goal
            }),
            raisedAmount: 0,
            owner: msg.sender
        });

        s_idToCampaign[id] = campaign;
        s_ownerToCampaigns[msg.sender].push(campaign);
        s_campaigns.push(campaign);

        emit NewCampaign(id, msg.sender, campaign);
        return id;
    }

    function donate(uint256 _id) external payable {
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
        if (address(this).balance >= campaign.goalDetails.goal) {
            campaign.status = CampaignStatus.Completed;
        }
    }

    function getCampaign(uint256 _id) external view returns (Campaign memory) {
        return s_idToCampaign[_id];
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        return s_campaigns;
    }
}
