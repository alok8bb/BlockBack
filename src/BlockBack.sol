// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/console.sol";

contract BlockBack {
    enum CampaignStatus {
        Active,
        Completed,
        Expired
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
        address owner;
    }

    uint256 private _nonce;

    mapping(uint256 => Campaign) private s_idToCampaign;
    mapping(address => Campaign[]) private s_ownerToCampaigns;
    Campaign[] private s_campaigns;

    event NewCampaign(
        uint256 indexed id,
        address indexed owner,
        Campaign indexed campaign
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
    ) external {
        uint256 randomId = uint256(
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
            owner: msg.sender
        });

        s_idToCampaign[randomId] = campaign;
        s_ownerToCampaigns[msg.sender].push(campaign);
        s_campaigns.push(campaign);

        emit NewCampaign(randomId, msg.sender, campaign);
    }

    function donate(uint256 _id) external payable {
        Campaign storage campaign = s_idToCampaign[_id];
        require(
            campaign.status == CampaignStatus.Active,
            "Campaign is not active"
        );
        require(block.timestamp < campaign.deadline, "Campaign has expired");
        require(
            msg.value >= campaign.goalDetails.minAmount,
            "Amount is less than minAmount"
        );
        require(
            msg.value <= campaign.goalDetails.maxAmount,
            "Amount is more than maxAmount"
        );

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
