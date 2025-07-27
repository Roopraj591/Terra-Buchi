# Terra Buchi
A blockchain-based game where players can explore, interact, and mint NFTs using wallet-based authentication.

## Live Demo
- [Primary Link](https://terrabuchi.web.app)
- [Backup Link](https://terrabuchi.firebaseapp.com/)

## Features
- Wallet-based authentication using MetaMask.
- Firebase integration for secure user management.
- Smart contract interaction for minting NFTs.
- Phaser.js-powered game mechanics.
- Deployed on Firebase Hosting and Functions.
- Used pyodide to use the HeatOfMixingCalculator.py in the frontend

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript, Phaser.js
- **Backend**: Node.js, Express, Firebase Admin SDK
- **Blockchain**: BlockDAG, ethers.js
- **Hosting**: Firebase Hosting and Functions

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/Roopraj591/Terra-Buchi.git
   ```
2. Navigate to the project directory:
   ```bash
   cd your-repo
   ```
3. Install dependencies for the backend:
   ```bash
   cd functions
   npm install
   ```
4. Start the Firebase emulators (optional for local testing):
   ```bash
   firebase emulators:start
   ```
5. Deploy the project to Firebase:
   ```bash
   firebase deploy
   ```

## Usage
1. Open the [Live Demo](https://terrabuchi.web.app).
2. Click "Connect Wallet" to authenticate using MetaMask.
3. Explore the game world and interact with objects by pressing space to dig holes and mint nft/fts and enter enterkey to interact with the npc.
4. To mint the unique alloy nft's you have to first defeat an enemy.
5. You can select your weapons during game before battle scene by pressing X.
6. During battle you can drag and drop the alloys into the weapons to increase the damage dealt on the enemy.
7. Mint NFTs directly from the game interface.
8. See you assets on the My Assets page
9. View all the minted nft's by all the players on the server in the NFT Showcase section

## Contract Addresses

Add your deployed contract addresses here:


- **elements.sol**: `0x4AeCB4C9231CA32Be97ED4826891e1CDF91589C6`
- **GameFTs.sol**: `0x28fBab7EE35D72C7c654D6931ce1b108FEf83DE2`
- **BDAG.sol**: `0x12CBa3319D391e97932E10E97aE82B3603aB2Ffa`
- **GameWeapon.sol**: `0x9D3acD8efD67078bfDFdB82BD5b9aaE863Aa13Ff`
- **VRFCoordinatorV2Mock.sol**: `0x524460F4862Ad0a296BB6854AB388C192a21B398`
- **mintAlloy.sol**: `0x2be9a62b05f29b645Ad55a665339b841D5bE35a7`


## Smart Contracts

The following smart contracts are included in this project:

- `GameFTs.sol`: Implements functionality for fungible tokens in the game.
  - `mint(address to, uint256 id, uint256 amount)`: Mints a specific amount of fungible tokens.
  - `setBaseURI(string memory newBaseURI)`: Updates the base URI for token metadata.

- `BDAG.sol`: Handles the BlockDAG-related logic.
  - `constructor(uint256 initialSupply)`: Initializes the BDAG token with an initial supply.

- `GameWeapon.sol`: Manages weapons and their attributes.
  - `mint(address to, uint256 id, uint256 amount)`: Mints a specific weapon.

- `VRFCoordinatorV2Mock.sol`: A mock contract for VRF (Verifiable Random Function) testing.
  - `constructor(uint96 _baseFee, uint96 _gasPriceLink)`: Initializes the mock VRF coordinator.

- `elements.sol`: Manages in-game elements.
  - `requestAll()`: Requests random elements and mole fractions using Chainlink VRF.

- `mintAlloy.sol`: Handles the minting of alloy-based NFTs.
  - `mint(address to, string memory elem1, string memory elem2, uint256 moleFrac, string memory color1, string memory color2)`: Mints a new alloy NFT with SVG metadata.

These contracts are located in the `contracts` folder.

## Deployment Scripts

The deployment scripts for the smart contracts are located in the `modules` folder. These scripts automate the process of deploying the contracts to the blockchain.

### Prerequisites
1. Install [Node.js](https://nodejs.org/).
2. Install Hardhat globally or locally in the project:
   ```bash
   npm install --save-dev hardhat

### How to Use the Deployment Scripts
1. Navigate to the `modules` folder:
   ```bash
   cd modules

2. Install dependencies 
   ```bash
    npm install

3. Compile the smart contracts:
   ```bash
    npm install

4. Deploy the contracts to a local Hardhat network:
   ```bash
    npx hardhat run scripts/deploy.js

5. To deploy to the blockDAG testnet use:
   ```bash
    npx hardhat run scripts/deploy.js --network blockdag

## Demo Video
[Watch the Demo Short Version(Under 3 min)](https://youtu.be/Qq_LS96P2Og)

## Contributors
- [ROOOPRAJ MURMU](https://github.com/Roopraj591)
- [RISHABH KUMAR JHA](https://github.com/Rishabh24-dsa)
- [SACHIN KUMAR](https://github.com/SKumar9696)

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

