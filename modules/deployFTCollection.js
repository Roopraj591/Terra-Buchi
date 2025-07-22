const hre = require("hardhat");
//ORIGINAL CODE:
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const nonce = await deployer.getNonce();
  console.log("Current nonce:", nonce);
  const GameItems = await hre.ethers.getContractFactory("GameFTs");
  const gasParams = {
    //gasPrice: ethers.parseUnits("15", "gwei"), // 20 Gwei
    //gasLimit: 3_000_000, // Fixed gas limit
    nonce:nonce
  };
  const contract = await GameItems.deploy(gasParams);

  await contract.waitForDeployment();

  console.log("✅ Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
