import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { HushSwap, HushSwap__factory, WrapETH, WrapETH__factory, WrapZama, WrapZama__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
};

async function deployFixture() {
  const wethFactory = (await ethers.getContractFactory("WrapETH")) as WrapETH__factory;
  const weth = (await wethFactory.deploy()) as WrapETH;
  const wethAddress = await weth.getAddress();

  const wzamaFactory = (await ethers.getContractFactory("WrapZama")) as WrapZama__factory;
  const wzama = (await wzamaFactory.deploy()) as WrapZama;
  const wzamaAddress = await wzama.getAddress();

  const swapFactory = (await ethers.getContractFactory("HushSwap")) as HushSwap__factory;
  const swap = (await swapFactory.deploy(wethAddress, wzamaAddress)) as HushSwap;
  const swapAddress = await swap.getAddress();

  return { weth, wzama, swap, wethAddress, wzamaAddress, swapAddress };
}

describe("HushSwap", function () {
  let signers: Signers;
  let weth: WrapETH;
  let wzama: WrapZama;
  let swap: HushSwap;
  let wethAddress: string;
  let wzamaAddress: string;
  let swapAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ weth, wzama, swap, wethAddress, wzamaAddress, swapAddress } = await deployFixture());
  });

  it("swaps wETH to wZama at a fixed 1:1000 rate", async function () {
    const clearWethAmount = 3;
    const expectedWzama = clearWethAmount * 1000;

    await weth.mint(signers.alice.address, clearWethAmount);
    await wzama.mint(swapAddress, expectedWzama);

    const encryptedInput = await fhevm
      .createEncryptedInput(wethAddress, signers.alice.address)
      .add64(clearWethAmount)
      .encrypt();

    const tx = await weth
      .connect(signers.alice)
      .confidentialTransferAndCall(swapAddress, encryptedInput.handles[0], encryptedInput.inputProof, "0x");
    await tx.wait();

    const encryptedWethBalance = await weth.confidentialBalanceOf(signers.alice.address);
    const clearWethBalance = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedWethBalance,
      wethAddress,
      signers.alice,
    );
    expect(clearWethBalance).to.eq(0);

    const encryptedWzamaBalance = await wzama.confidentialBalanceOf(signers.alice.address);
    const clearWzamaBalance = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedWzamaBalance,
      wzamaAddress,
      signers.alice,
    );
    expect(clearWzamaBalance).to.eq(expectedWzama);
  });
});
