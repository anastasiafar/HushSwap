// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {IERC7984} from "@openzeppelin/confidential-contracts/interfaces/IERC7984.sol";
import {IERC7984Receiver} from "@openzeppelin/confidential-contracts/interfaces/IERC7984Receiver.sol";
import {FHE, ebool, euint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract HushSwap is IERC7984Receiver, ZamaEthereumConfig {
    uint64 public constant SWAP_RATE = 1000;

    IERC7984 public immutable weth;
    IERC7984 public immutable wzama;

    event SwapExecuted(address indexed user, euint64 wethIn, euint64 wzamaOut);

    constructor(address wethAddress, address wzamaAddress) {
        require(wethAddress != address(0) && wzamaAddress != address(0), "Invalid token address");
        weth = IERC7984(wethAddress);
        wzama = IERC7984(wzamaAddress);
    }

    function swapRate() external pure returns (uint64) {
        return SWAP_RATE;
    }

    function onConfidentialTransferReceived(
        address,
        address from,
        euint64 amount,
        bytes calldata
    ) external returns (ebool) {
        if (msg.sender != address(weth)) {
            return FHE.asEbool(false);
        }

        euint64 outputAmount = FHE.mul(amount, SWAP_RATE);
        FHE.allowThis(outputAmount);

        euint64 transferred = wzama.confidentialTransfer(from, outputAmount);
        emit SwapExecuted(from, amount, transferred);

        return FHE.asEbool(true);
    }
}
