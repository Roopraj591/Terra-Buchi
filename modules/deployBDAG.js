const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const BDAG = await hre.ethers.getContractFactory("BDAG");
   const [deployer] = await hre.ethers.getSigners();
  // Set initial supply (e.g., 1,000,000 tokens with 18 decimals)
  const initialSupply = hre.ethers.parseUnits("1000000", 18);
    const nonce = await deployer.getNonce();
  const gasParams = {
    //gasPrice: ethers.parseUnits("15", "gwei"), // Optional: adjust as needed
    //gasLimit: 3_000_000, // Optional: adjust as needed
    nonce: nonce
  };
  // Deploy the contract
  console.log("🚀 Deploying BDAG token...");
  const bdag = await BDAG.deploy(initialSupply,gasParams);
  
  // Wait for deployment confirmation
  await bdag.waitForDeployment();
  
  console.log("✅ BDAG deployed to:", await bdag.getAddress());
  console.log("Initial supply:", hre.ethers.formatUnits(initialSupply, 18), "BDAG");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });