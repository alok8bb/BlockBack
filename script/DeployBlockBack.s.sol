// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {Script} from "../lib/forge-std/src/Script.sol";
import {BlockBack} from "../src/BlockBack.sol";

contract DeployBlockBack is Script {
    function run() external returns (BlockBack) {
        vm.startBroadcast();
        BlockBack blockBack = new BlockBack();
        vm.stopBroadcast();
        return (blockBack);
    }
}
