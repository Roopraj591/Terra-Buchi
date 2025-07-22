require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  
  networks:{
    blockdag:{
      url: process.env.BDAG_RPC,
      chainId: 1043,
      accounts: [process.env.PRIVATE_KEY],
     gasPrice: 1000000000, // 1 Gwei
      gas: 8000000, // 8 million gas (up from default 1M)
      gasMultiplier: 1.5, // 50% buffer
      timeout: 600000
      //throwOnTransactionFailures: false // Prevents Hardhat from rejecting high-fee txns
    },
  }
};
