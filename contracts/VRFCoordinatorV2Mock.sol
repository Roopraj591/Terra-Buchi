// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2Mock.sol";

// Dummy contract just to trigger compilation
contract CompileHelper is VRFCoordinatorV2Mock {
    constructor(uint96 _baseFee, uint96 _gasPriceLink) VRFCoordinatorV2Mock(_baseFee, _gasPriceLink) {}
}