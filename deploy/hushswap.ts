import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedWETH = await deploy("WrapETH", {
    from: deployer,
    log: true,
  });

  const deployedWZama = await deploy("WrapZama", {
    from: deployer,
    log: true,
  });

  const deployedSwap = await deploy("HushSwap", {
    from: deployer,
    args: [deployedWETH.address, deployedWZama.address],
    log: true,
  });

  console.log(`WrapETH contract: ${deployedWETH.address}`);
  console.log(`WrapZama contract: ${deployedWZama.address}`);
  console.log(`HushSwap contract: ${deployedSwap.address}`);
};

export default func;
func.id = "deploy_hushswap";
func.tags = ["HushSwap"];
