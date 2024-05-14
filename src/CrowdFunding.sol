// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

contract CrowdFunding {
    uint public counter;

    constructor() {
        counter = 0;
    }

    struct Campaign {
        uint id;
        address ownerAddress;
        string metadataHash; // ipfs
        uint raisedAmount;
        uint minAmount;
        uint maxAmount;
        uint deadline;
        uint totalFundraiseAmount;
        bool isActive;
    }

    struct Contribution {
        uint id;
        uint amount;
    }

    mapping(address => Campaign[]) private ownerToCampaigns;
    mapping(uint => Campaign) private idToCampaign;
    mapping(address => Contribution) private contributionToContributor;

    function getCampaign(
        address _address
    ) public view returns (Campaign[] memory) {
        return ownerToCampaigns[_address];
    }

    function getCampaignById(uint id) public view returns (Campaign memory) {
        return idToCampaign[id];
    }

    function getContributions() public view returns (Contribution memory) {
        return contributionToContributor[msg.sender];
    }

    function createCampaign(
        string memory _metadataHash,
        uint _minAmount,
        uint _maxAmount,
        uint _deadline,
        uint _totalFundraiseAmount
    ) public {
        Campaign[] storage _ownedCampaigns = ownerToCampaigns[msg.sender];
        Campaign memory _newCampaign = Campaign({
            id: counter,
            ownerAddress: msg.sender,
            metadataHash: _metadataHash,
            raisedAmount: 0,
            minAmount: _minAmount,
            maxAmount: _maxAmount,
            deadline: _deadline,
            isActive: true,
            totalFundraiseAmount: _totalFundraiseAmount
        });
        _ownedCampaigns.push(_newCampaign);
        idToCampaign[counter] = _newCampaign;

        ownerToCampaigns[msg.sender] = _ownedCampaigns;

        counter++;
    }

    function showThis() public payable returns (uint) {
        return msg.value;
    }

    function contribute(uint id) external payable {
        Campaign memory campaign = idToCampaign[id];

        require(
            msg.value <= campaign.maxAmount && msg.value >= campaign.minAmount,
            "Contribution amount must be within the allowed range specified by the campaign."
        );
        require(
            campaign.raisedAmount <= campaign.totalFundraiseAmount,
            "Campaign's raised amount has met the total fundraise amount."
        );

        campaign.raisedAmount += msg.value;
        contributionToContributor[msg.sender] = Contribution({
            id: campaign.id,
            amount: msg.value
        });
    }
}
