// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {Script} from "../lib/forge-std/src/Script.sol";
import {BlockBack} from "../src/BlockBack.sol";

contract DeployBlockBack is Script {
    function run() external returns (BlockBack) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        BlockBack blockBack = new BlockBack();
        vm.stopBroadcast();
        return (blockBack);
    }
}
