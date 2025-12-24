import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * Example:
 *   - npx hardhat --network localhost task:swap-addresses
 *   - npx hardhat --network sepolia task:swap-addresses
 */
task("task:swap-addresses", "Prints the HushSwap, WrapETH, and WrapZama addresses").setAction(
  async function (_taskArguments: TaskArguments, hre) {
    const { deployments } = hre;

    const swap = await deployments.get("HushSwap");
    const weth = await deployments.get("WrapETH");
    const wzama = await deployments.get("WrapZama");

    console.log(`HushSwap: ${swap.address}`);
    console.log(`WrapETH: ${weth.address}`);
    console.log(`WrapZama: ${wzama.address}`);
  },
);

/**
 * Example:
 *   - npx hardhat --network localhost task:swap --amount 2
 *   - npx hardhat --network sepolia task:swap --amount 2
 */
task("task:swap", "Swaps wETH for wZama using confidentialTransferAndCall")
  .addParam("amount", "Clear wETH amount (uint64)")
  .addOptionalParam("swap", "Optionally specify the HushSwap contract address")
  .addOptionalParam("weth", "Optionally specify the WrapETH contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const clearAmount = parseInt(taskArguments.amount);
    if (!Number.isInteger(clearAmount) || clearAmount <= 0) {
      throw new Error(`Argument --amount must be a positive integer`);
    }

    await fhevm.initializeCLIApi();

    const swapDeployment = taskArguments.swap ? { address: taskArguments.swap } : await deployments.get("HushSwap");
    const wethDeployment = taskArguments.weth ? { address: taskArguments.weth } : await deployments.get("WrapETH");

    const signers = await ethers.getSigners();
    const caller = signers[0];

    const encryptedInput = await fhevm
      .createEncryptedInput(wethDeployment.address, caller.address)
      .add64(clearAmount)
      .encrypt();

    const weth = await ethers.getContractAt("WrapETH", wethDeployment.address);
    const tx = await weth
      .connect(caller)
      .confidentialTransferAndCall(swapDeployment.address, encryptedInput.handles[0], encryptedInput.inputProof, "0x");
    console.log(`Waiting for swap tx: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Swap tx status: ${receipt?.status}`);
  });
