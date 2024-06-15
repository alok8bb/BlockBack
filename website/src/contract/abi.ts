export const BlockBack_ABI = [
  { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
  { "type": "receive", "stateMutability": "payable" },
  {
    "type": "function",
    "name": "contribute",
    "inputs": [{ "name": "_id", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "payable",
  },
  {
    "type": "function",
    "name": "createCampaign",
    "inputs": [
      { "name": "_metadataHash", "type": "string", "internalType": "string" },
      { "name": "_minAmount", "type": "uint256", "internalType": "uint256" },
      { "name": "_maxAmount", "type": "uint256", "internalType": "uint256" },
      { "name": "_goal", "type": "uint256", "internalType": "uint256" },
      { "name": "_deadline", "type": "uint256", "internalType": "uint256" },
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
  },
  {
    "type": "function",
    "name": "getAllCampaigns",
    "inputs": [],
    "outputs": [{
      "name": "",
      "type": "tuple[]",
      "internalType": "struct BlockBack.Campaign[]",
      "components": [
        { "name": "id", "type": "uint256", "internalType": "uint256" },
        {
          "name": "status",
          "type": "uint8",
          "internalType": "enum BlockBack.CampaignStatus",
        },
        { "name": "metadataHash", "type": "string", "internalType": "string" },
        { "name": "deadline", "type": "uint256", "internalType": "uint256" },
        {
          "name": "goalDetails",
          "type": "tuple",
          "internalType": "struct BlockBack.GoalDetails",
          "components": [{
            "name": "minAmount",
            "type": "uint256",
            "internalType": "uint256",
          }, {
            "name": "maxAmount",
            "type": "uint256",
            "internalType": "uint256",
          }, { "name": "goal", "type": "uint256", "internalType": "uint256" }],
        },
        {
          "name": "raisedAmount",
          "type": "uint256",
          "internalType": "uint256",
        },
        { "name": "owner", "type": "address", "internalType": "address" },
      ],
    }],
    "stateMutability": "view",
  },
  {
    "type": "function",
    "name": "getBalance",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view",
  },
  {
    "type": "function",
    "name": "getCampaign",
    "inputs": [{ "name": "_id", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{
      "name": "",
      "type": "tuple",
      "internalType": "struct BlockBack.Campaign",
      "components": [
        { "name": "id", "type": "uint256", "internalType": "uint256" },
        {
          "name": "status",
          "type": "uint8",
          "internalType": "enum BlockBack.CampaignStatus",
        },
        { "name": "metadataHash", "type": "string", "internalType": "string" },
        { "name": "deadline", "type": "uint256", "internalType": "uint256" },
        {
          "name": "goalDetails",
          "type": "tuple",
          "internalType": "struct BlockBack.GoalDetails",
          "components": [{
            "name": "minAmount",
            "type": "uint256",
            "internalType": "uint256",
          }, {
            "name": "maxAmount",
            "type": "uint256",
            "internalType": "uint256",
          }, { "name": "goal", "type": "uint256", "internalType": "uint256" }],
        },
        {
          "name": "raisedAmount",
          "type": "uint256",
          "internalType": "uint256",
        },
        { "name": "owner", "type": "address", "internalType": "address" },
      ],
    }],
    "stateMutability": "view",
  },
  {
    "type": "function",
    "name": "getCampaignsByCreator",
    "inputs": [],
    "outputs": [{
      "name": "",
      "type": "tuple[]",
      "internalType": "struct BlockBack.Campaign[]",
      "components": [
        { "name": "id", "type": "uint256", "internalType": "uint256" },
        {
          "name": "status",
          "type": "uint8",
          "internalType": "enum BlockBack.CampaignStatus",
        },
        { "name": "metadataHash", "type": "string", "internalType": "string" },
        { "name": "deadline", "type": "uint256", "internalType": "uint256" },
        {
          "name": "goalDetails",
          "type": "tuple",
          "internalType": "struct BlockBack.GoalDetails",
          "components": [{
            "name": "minAmount",
            "type": "uint256",
            "internalType": "uint256",
          }, {
            "name": "maxAmount",
            "type": "uint256",
            "internalType": "uint256",
          }, { "name": "goal", "type": "uint256", "internalType": "uint256" }],
        },
        {
          "name": "raisedAmount",
          "type": "uint256",
          "internalType": "uint256",
        },
        { "name": "owner", "type": "address", "internalType": "address" },
      ],
    }],
    "stateMutability": "view",
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view",
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable",
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [{
      "name": "newOwner",
      "type": "address",
      "internalType": "address",
    }],
    "outputs": [],
    "stateMutability": "nonpayable",
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable",
  },
  {
    "type": "function",
    "name": "withdrawCampaign",
    "inputs": [{ "name": "_id", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "payable",
  },
  {
    "type": "event",
    "name": "CampaignWithrawn",
    "inputs": [{
      "name": "campaignId",
      "type": "uint256",
      "indexed": true,
      "internalType": "uint256",
    }, {
      "name": "owner",
      "type": "address",
      "indexed": true,
      "internalType": "address",
    }],
    "anonymous": false,
  },
  {
    "type": "event",
    "name": "DonationSuccess",
    "inputs": [{
      "name": "campaignId",
      "type": "uint256",
      "indexed": true,
      "internalType": "uint256",
    }, {
      "name": "amount",
      "type": "uint256",
      "indexed": true,
      "internalType": "uint256",
    }, {
      "name": "donator",
      "type": "address",
      "indexed": true,
      "internalType": "address",
    }],
    "anonymous": false,
  },
  {
    "type": "event",
    "name": "NewCampaign",
    "inputs": [{
      "name": "id",
      "type": "uint256",
      "indexed": true,
      "internalType": "uint256",
    }, {
      "name": "owner",
      "type": "address",
      "indexed": true,
      "internalType": "address",
    }, {
      "name": "campaign",
      "type": "tuple",
      "indexed": true,
      "internalType": "struct BlockBack.Campaign",
      "components": [
        { "name": "id", "type": "uint256", "internalType": "uint256" },
        {
          "name": "status",
          "type": "uint8",
          "internalType": "enum BlockBack.CampaignStatus",
        },
        { "name": "metadataHash", "type": "string", "internalType": "string" },
        { "name": "deadline", "type": "uint256", "internalType": "uint256" },
        {
          "name": "goalDetails",
          "type": "tuple",
          "internalType": "struct BlockBack.GoalDetails",
          "components": [{
            "name": "minAmount",
            "type": "uint256",
            "internalType": "uint256",
          }, {
            "name": "maxAmount",
            "type": "uint256",
            "internalType": "uint256",
          }, { "name": "goal", "type": "uint256", "internalType": "uint256" }],
        },
        {
          "name": "raisedAmount",
          "type": "uint256",
          "internalType": "uint256",
        },
        { "name": "owner", "type": "address", "internalType": "address" },
      ],
    }],
    "anonymous": false,
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [{
      "name": "previousOwner",
      "type": "address",
      "indexed": true,
      "internalType": "address",
    }, {
      "name": "newOwner",
      "type": "address",
      "indexed": true,
      "internalType": "address",
    }],
    "anonymous": false,
  },
  {
    "type": "error",
    "name": "BlockBack__AmountLessThanMinAmount",
    "inputs": [],
  },
  {
    "type": "error",
    "name": "BlockBack__AmountMoreThanMaxAmount",
    "inputs": [],
  },
  { "type": "error", "name": "BlockBack__CampaignExpired", "inputs": [] },
  { "type": "error", "name": "BlockBack__CampaignInactive", "inputs": [] },
  { "type": "error", "name": "BlockBack__DeadlineNotMet", "inputs": [] },
  { "type": "error", "name": "BlockBack__OnlyOwnerCanWithdraw", "inputs": [] },
] as const;
