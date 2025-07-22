require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const nonce = await hre.ethers.provider.getTransactionCount(deployer.address, "latest");
  console.log("Using nonce:", nonce);

const feeData = await hre.ethers.provider.getFeeData();
const gasPrice = feeData.gasPrice;  
const increasedGasPrice = gasPrice * 110n / 100n; 
  const bdagAddress = process.env.BDAG_ADDRESS;
  if (!bdagAddress) throw "Please set BDAG_ADDRESS in .env";

  const costPerMint = hre.ethers.parseUnits("1.0", 18);
  const GameWeapon = await hre.ethers.getContractFactory("GameWeapon");
  const gameWeapon = await GameWeapon.deploy(bdagAddress, costPerMint, {
    nonce: nonce,
    gasPrice: increasedGasPrice,
  });

  await gameWeapon.waitForDeployment();
  console.log("GameWeapon deployed at:", await gameWeapon.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});