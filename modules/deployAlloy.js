const { ethers } = require("hardhat");

async function main() {
  console.log("⚙️ Deploying CompoundSVGNFT...");

  // 1. Compile and get ContractFactory
  const Compound = await ethers.getContractFactory("CompoundSVGNFT");

  // 2. Deploy the contract
  const compound = await Compound.deploy();
  await compound.waitForDeployment();
  
  console.log("✅ CompoundSVGNFT deployed at:", compound.target);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Deployment failed:", err);
    process.exit(1);
  });