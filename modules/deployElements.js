const { ethers } = require("hardhat");

async function main () {
  
  const VRFCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock");
  const mockVRF = await VRFCoordinatorV2Mock.deploy(0, 0);
  await mockVRF.waitForDeployment({ gasLimit: 6_000_000 });                        
  const mockAddress = await mockVRF.getAddress();           
  console.log("▶ Mock VRF deployed  ➜", mockAddress);

  
  const tx = await mockVRF.createSubscription();            
  const receipt   = await tx.wait();
  const subId = receipt.logs[0].args.subId;                 
  await mockVRF.fundSubscription(subId, 0);                 
  console.log("▶ Subscription ID   ➜", subId.toString());

  
  const RandomElements = await ethers.getContractFactory("RandomElementsWithMoleFraction");
  const random = await RandomElements.deploy(subId, mockAddress);
  await random.waitForDeployment();
  const consumerAddr = await random.getAddress();
  console.log("▶ Consumer deployed ➜", consumerAddr);

 
  await mockVRF.addConsumer(subId, consumerAddr);           
  console.log("✔ Added consumer to sub");

  console.log("\n✅ Local VRF stack is ready!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});