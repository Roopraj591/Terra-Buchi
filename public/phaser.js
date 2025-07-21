
import { AssetManager } from './asset-manager.js';
/*const cfg = {    apiKey: "AIzaSyBP-5FVS6XtraM5a5L5TDi9HguJNL-r_3I",
    authDomain: "terrabuchi.firebaseapp.com",
    databaseURL: "https://terrabuchi-default-rtdb.firebaseio.com",
    projectId: "terrabuchi",
    storageBucket: "terrabuchi.firebasestorage.app",
    messagingSenderId: "765877243373",
    appId: "1:765877243373:web:b7f225df14615aa5da2be4",
    measurementId: "G-T8CHH27DVW"};
if (!firebase.apps.length) firebase.initializeApp(cfg);
const auth = firebase.auth();
const db = firebase.database();

// 2. Wait for auth before starting game
auth.onAuthStateChanged(user => {
  if (!user) {
    console.log("Not signed in yet");
    //window.location = 'homepage.html';
    //return;
  }
  else{
    console.log('Authenticated', user.uid);
    startPhaserGame(user.uid);}
});*/
document.addEventListener('DOMContentLoaded', function() {
  // Minting UI Controller
  const mintPopup = {
    element: document.getElementById('mint-popup'),
    message: document.querySelector('.mint-message'),
    okButton: document.getElementById('ok-button'),
    phaserScene: null, // Will store reference to Phaser scene
    
    init: function() {
      // Setup OK button handler
      this.okButton.addEventListener('click', () => {
        this.hide();
      });
      return this;
    },
    
    // Call this when creating your Phaser scene
    registerScene: function(scene) {
      this.phaserScene = scene;
    },
    
    show: function(text, showOkButton = false) {
      this.message.textContent = text;
      this.element.classList.remove('hidden');
      
      // Pause Phaser scene if registered
      if (this.phaserScene) {
        this.phaserScene.scene.pause();
        if (this.phaserScene.physics) {
          this.phaserScene.physics.pause();
        }
      }
      
      if (showOkButton) {
        this.okButton.classList.remove('hidden');
      } else {
        this.okButton.classList.add('hidden');
        // Auto-hide after 5 seconds if no button
       // setTimeout(() => this.hide(), 5000);
      }
      
      // Reset animation
      this.element.style.animation = 'none';
      void this.element.offsetWidth;
      this.element.style.animation = 'slideIn 0.3s ease-out forwards';
    },
    
   hide: function() {
      this.element.classList.add('hidden');
      this.okButton.classList.add('hidden');
      
      // Resume Phaser scene if registered
      if (this.phaserScene) {
        this.phaserScene.scene.resume();
        if (this.phaserScene.physics) {
          this.phaserScene.physics.resume();
        }
      }
    }
  }.init(); // Immediately initialize

  // Make mintPopup available globally
  window.mintPopup = mintPopup;
});
const CONTRACT_ADDRESS="0xc761fF121D22544E6a21bBC81BED29F95120eE4d"//mintReward
const GameFTs_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC1155InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC1155InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "idsLength",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "valuesLength",
          "type": "uint256"
        }
      ],
      "name": "ERC1155InvalidArrayLength",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC1155InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC1155InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC1155InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC1155MissingApprovalForAll",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        }
      ],
      "name": "TransferBatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "TransferSingle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "URI",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "MAX_ID",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_ID",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "accounts",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "baseURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "name": "mintBatch",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeBatchTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newBaseURI",
          "type": "string"
        }
      ],
      "name": "setBaseURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "uri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
/*const CONTRACT_ADDRESS2 = "0x68b60c0E25e7b3141Cb341f46519D3A97A82aB1E"; 
const GAMENFTS_ABI = [  
     {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getTokenType",
      "outputs": [
        {
          "internalType": "enum GameNFTs.TokenType",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum GameNFTs.TokenType",
          "name": "bodyPart",
          "type": "uint8"
        }
      ],
      "name": "isBodyPartMinted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "enum GameNFTs.TokenType",
          "name": "bodyPart",
          "type": "uint8"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newuri",
          "type": "string"
        }
      ],
      "name": "setURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    } ];*/

const CONTRACT_ADDRESS3="0x6E0Af682c0741660B35126F6Aabf51D6666Bf4dD";//mintItem
const WEAPONS_ABI=[
        {
      "inputs": [
        {
          "internalType": "address",
          "name": "_bdagToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_costPerMint",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC1155InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC1155InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "idsLength",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "valuesLength",
          "type": "uint256"
        }
      ],
      "name": "ERC1155InvalidArrayLength",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC1155InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC1155InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC1155InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC1155MissingApprovalForAll",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        }
      ],
      "name": "TransferBatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "TransferSingle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "URI",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "MAX_ID",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_ID",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "accounts",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "bdag",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "costPerMint",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMintCost",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "name": "mintBatch",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeBatchTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newCost",
          "type": "uint256"
        }
      ],
      "name": "setCost",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newuri",
          "type": "string"
        }
      ],
      "name": "setURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "uri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "withdrawBDAG",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }];
const BDAG_ADDRESS="0xa0847326c94EC729946D9c2CC78baDa78df6b224";
const ERC20_ABI = [
 {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "initialSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];
const CONTRACT_ADDRESS4="0x4AeCB4C9231CA32Be97ED4826891e1CDF91589C6"//requestRandomElements:main contract
const RANDOM_ELEMENTS_ABI=
[ {"inputs": [
        {
          "internalType": "uint64",
          "name": "_subId",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "vrfCoordinator",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "have",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "want",
          "type": "address"
        }
      ],
      "name": "OnlyCoordinatorCanFulfill",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        }
      ],
      "name": "RequestSent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "e1",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "e2",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "moleFrac",
          "type": "uint256"
        }
      ],
      "name": "Result",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "COORDINATOR",
      "outputs": [
        {
          "internalType": "contract VRFCoordinatorV2Interface",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "callbackGas",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "elem1",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "elem2",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "elements",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getResult",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "keyHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lastRequestId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "moleFraction",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "numWords",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "randomWords",
          "type": "uint256[]"
        }
      ],
      "name": "rawFulfillRandomWords",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "reqConf",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "requestAll",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "subId",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }];
const MOCK_VRF_ADDRESS="0x524460F4862Ad0a296BB6854AB388C192a21B398"// requestRandomElements:MockVRF Contract
const VRF_COORDINATOR_ABI=[{
      "inputs": [
        {
          "internalType": "uint96",
          "name": "_baseFee",
          "type": "uint96"
        },
        {
          "internalType": "uint96",
          "name": "_gasPriceLink",
          "type": "uint96"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidConsumer",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidRandomWords",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSubscription",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "MustBeSubOwner",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Reentrant",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TooManyConsumers",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "ConfigSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "subId",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "consumer",
          "type": "address"
        }
      ],
      "name": "ConsumerAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "subId",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "consumer",
          "type": "address"
        }
      ],
      "name": "ConsumerRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "outputSeed",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint96",
          "name": "payment",
          "type": "uint96"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "name": "RandomWordsFulfilled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "keyHash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "preSeed",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "subId",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "minimumRequestConfirmations",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "callbackGasLimit",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "numWords",
          "type": "uint32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RandomWordsRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "subId",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "SubscriptionCanceled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "subId",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "SubscriptionCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "subId",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "oldBalance",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newBalance",
          "type": "uint256"
        }
      ],
      "name": "SubscriptionFunded",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "BASE_FEE",
      "outputs": [
        {
          "internalType": "uint96",
          "name": "",
          "type": "uint96"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "GAS_PRICE_LINK",
      "outputs": [
        {
          "internalType": "uint96",
          "name": "",
          "type": "uint96"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_CONSUMERS",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "acceptOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "acceptSubscriptionOwnerTransfer",
      "outputs": [],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_subId",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "_consumer",
          "type": "address"
        }
      ],
      "name": "addConsumer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_subId",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "cancelSubscription",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_subId",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "_consumer",
          "type": "address"
        }
      ],
      "name": "consumerIsAdded",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "createSubscription",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "_subId",
          "type": "uint64"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_requestId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_consumer",
          "type": "address"
        }
      ],
      "name": "fulfillRandomWords",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_requestId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_consumer",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_words",
          "type": "uint256[]"
        }
      ],
      "name": "fulfillRandomWordsWithOverride",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_subId",
          "type": "uint64"
        },
        {
          "internalType": "uint96",
          "name": "_amount",
          "type": "uint96"
        }
      ],
      "name": "fundSubscription",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getConfig",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "minimumRequestConfirmations",
          "type": "uint16"
        },
        {
          "internalType": "uint32",
          "name": "maxGasLimit",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "stalenessSeconds",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "gasAfterPaymentCalculation",
          "type": "uint32"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getFallbackWeiPerUnitLink",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getFeeConfig",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "fulfillmentFlatFeeLinkPPMTier1",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "fulfillmentFlatFeeLinkPPMTier2",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "fulfillmentFlatFeeLinkPPMTier3",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "fulfillmentFlatFeeLinkPPMTier4",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "fulfillmentFlatFeeLinkPPMTier5",
          "type": "uint32"
        },
        {
          "internalType": "uint24",
          "name": "reqsForTier2",
          "type": "uint24"
        },
        {
          "internalType": "uint24",
          "name": "reqsForTier3",
          "type": "uint24"
        },
        {
          "internalType": "uint24",
          "name": "reqsForTier4",
          "type": "uint24"
        },
        {
          "internalType": "uint24",
          "name": "reqsForTier5",
          "type": "uint24"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRequestConfig",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        },
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        },
        {
          "internalType": "bytes32[]",
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_subId",
          "type": "uint64"
        }
      ],
      "name": "getSubscription",
      "outputs": [
        {
          "internalType": "uint96",
          "name": "balance",
          "type": "uint96"
        },
        {
          "internalType": "uint64",
          "name": "reqCount",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address[]",
          "name": "consumers",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "pendingRequestExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_subId",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "_consumer",
          "type": "address"
        }
      ],
      "name": "removeConsumer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_keyHash",
          "type": "bytes32"
        },
        {
          "internalType": "uint64",
          "name": "_subId",
          "type": "uint64"
        },
        {
          "internalType": "uint16",
          "name": "_minimumRequestConfirmations",
          "type": "uint16"
        },
        {
          "internalType": "uint32",
          "name": "_callbackGasLimit",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "_numWords",
          "type": "uint32"
        }
      ],
      "name": "requestRandomWords",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "requestSubscriptionOwnerTransfer",
      "outputs": [],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "setConfig",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }];
const ALLOY_ADDRESS="0xa29F2bFAEA444fCA2F3C1e7E3340F5d2Fd1ca121"//mintCompoundNFT
const ALLOY_ABI=[{
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_fromTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_toTokenId",
          "type": "uint256"
        }
      ],
      "name": "BatchMetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "MetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "elem1",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "elem2",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "moleFrac",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "color1",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "color2",
          "type": "string"
        }
      ],
      "name": "buildTokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "elem1",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "elem2",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "moleFrac",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "color1",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "color2",
          "type": "string"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }]
console.log("Player assets initialized:", window.playerAssets);
//localStorage.clear();
//game.canvas.getContext('2d').imageSmoothingEnabled = false;
class WorldScene extends Phaser.Scene {
    constructor(db) {
        super('WorldScene'); // Scene identifier
        this.inventory = {
            items: [],
            selectedIndex: 0,
            isOpen: false
        };
        // Initialize all inventory elements as null
        this.inventoryBg = null;
        this.inventoryTitle = null;
        this.itemContainer = null;
        this.selectionIndicator = null;
        this.lastMoveTime = 0;
        this.moveDelay = 200; 
        this.db = db;
        this.inventoryUI = null;
    }

 preload(){
    console.log("Preload started");

    this.load.image("final_map", "../assets/final_map.png");
   this.load.image('pixil-frame-0', '../assets/pixil-frame-0.png');
  this.load.image('tiles_cropped', '../assets/tiles_cropped (3).png');
  this.load.image('base_out_atlas', '../assets/base_out_atlas.png');
  this.load.image('hole','../assets/hole2.png');
   this.load.image('1','../assets/1.png');
   this.load.image('4','../assets/4.png');
   this.load.image('tent1','../assets/tent1.png');
   this.load.image('tent2','../assets/tent2.png');
  this.load.tilemapTiledJSON("map","../assets/final_map_part4-latest.json");

  this.load.image('benitoite',"../assetsFT/1.png");
  this.load.image('paintite', "../assetsFT/2.png");
this.load.image('serendibite', "../assetsFT/3.png");
this.load.image('rose_quartz', "../assetsFT/4.png");
this.load.image('diamond', "../assetsFT/5.png");
this.load.image('red_diamond', "../assetsFT/6.png");
this.load.image('blue_diamond', "../assetsFT/7.png");
this.load.image('bronze_coin', "../assetsFT/8.png");
this.load.image('copper_coin', "../assetsFT/9.png");
this.load.image('gold_coin', "../assetsFT/10.png");
this.load.image('silver_coin', "../assetsFT/11.png");
this.load.image('crown', "../assetsFT/12.png");
this.load.image('shard', "../assetsFT/13.png");
this.load.image('bone', "../assetsFT/14.png");
this.load.image('rare_crown', "../assetsFT/15.png");


  this.load.spritesheet('hero','../assets/MC.png',{frameWidth:64,frameHeight:64});
  //this.load.json('playerShapes', '../assets/playerJson.json');
  //this.load.animation('animationJson','./src/animations.json');
  this.load.animation('animationJson2','../animation2.json');
  this.load.spritesheet('npc1','../assets/shopkeeper.png',{
    frameWidth:32,
    frameHeight:32
  });
  
  this.load.image('item1','../assetsWeapon/12.png');
  this.load.image('item2','../assetsWeapon/1.png');
  this.load.image('item3','../assetsWeapon/2.png');
  this.load.image('item4','../assetsWeapon/3.png');
  this.load.image('item5','../assetsWeapon/4.png');
  this.load.image('item6','../assetsWeapon/5.png');
  this.load.image('item7','../assetsWeapon/6.png');
  this.load.image('item8','../assetsWeapon/7.png');
  this.load.image('item9','../assetsWeapon/8.png');
  this.load.image('item10','../assetsWeapon/9.png');
  this.load.image('item11','../assetsWeapon/10.png');
  this.load.image('item12','../assetsWeapon/11.png');
  this.load.audio('menu','../soundassets/sound-1-167181.mp3')
  this.load.audio('popup','./soundassets/ui-sound-374228.mp3')
  this.load.audio('collision','../soundassets/391658__jeckkech__collision.wav')
  this.load.audio('dig','../soundassets/digging-70624.mp3')
  this.load.audio('bg_music','../soundassets/game-music-loop-7-145285.mp3')

}


async  create(){
   this.inventoryUI = new InventoryUI(this);
  if (window.mintPopup) {
      window.mintPopup.registerScene(this);
    }
  this.bgm=this.sound.add('bg_music');
  this.touched=this.sound.add('collision',{volume:0.2});
  this.menusound=this.sound.add('menu',{volume:0.7});
  this.dig_sound=this.sound.add('dig',{volume:1});
   this.dig_sound.addMarker({
    name: 'shortDig',
    start: 1.1,      // seconds in
    duration: 1.6,   // how long to play
    config: {
      loop: false,
      volume: 0.5
    }
  });
  this.popup_sound=this.sound.add('popup',{volume:0.7});
  this.bgm.loop=true;
  this.bgm.play( );
  this.matter.world.setGravity(0, 0);
  this.cursors = this.input.keyboard.createCursorKeys();
    const map=this.make.tilemap({key: "map"});
    console.log("Layer names:", map.layers.map(l => l.name));
    const t1 = map.addTilesetImage('pixil-frame-0', 'pixil-frame-0');
    const t2 = map.addTilesetImage('tiles_cropped', 'tiles_cropped');
 
    const t11 = map.addTilesetImage('base_out_atlas', 'base_out_atlas');
    const t12=map.addTilesetImage('final_map','final_map');
    const t13=map.addTilesetImage('1','1');
    const t14=map.addTilesetImage('4','4');
    const t15=map.addTilesetImage('tent1','tent1');
    const t16=map.addTilesetImage('tent2','tent2');
    const water=map.createLayer("water",t11,0,0);
    water.setDepth(0);
    const grass=map.createLayer("grass",[t11,t12,t1],0,0);
    grass.setDepth(2);
    const dirt=map.createLayer("dirt",t11,0,0);
    dirt.setDepth(10);
    const tree=map.createLayer("trees",[t2,t11,t13,t14,t15,t16],0,0);
    tree.setDepth(12);
    const treetop=map.createLayer("tree_top",[t2,t11,t13,t14,t15,t16],0,0);
    treetop.setDepth(14);


    
const cam = this.cameras.main;
const mapWidth = map.widthInPixels;
const mapHeight = map.heightInPixels;

const scaleX = this.scale.width / mapWidth;
const scaleY = this.scale.height / mapHeight;
const zoom = Math.max(scaleX, scaleY);

cam.setBounds(0, 0, mapWidth, mapHeight);
cam.setZoom(zoom*2)

//const shapes = this.cache.json.get('playerShapes');
this.hero=this.matter.add.sprite(730,150,'hero',null,{shape:{type: 'rectangle', width: 16,height:34},isStatic:false,label:'hero',
  friction: 0.5,staticFriction:0.5,ignoreGravity:true,inertia: Infinity, isBullet: true});
this.hero.setScale(0.4);
this.hero.setFrictionAir(0.1);
this.hero.setDepth(10)
/*this.player = this.matter.add.sprite(740, 150, 'player', null,{ shape: {type: 'rectangle', width: 16,height:16},isStatic: false,label:'player',
  friction: 0.5,staticFriction:0.5,ignoreGravity: true,inertia: Infinity, isBullet: true});
//this.player.setScale(1,0.44);
this.player.setFrictionAir(0.1);
console.log(this.player.width);
console.log(this.player.height);
this.player.setDepth(10);
this.player.setScale(0.84);*/

this.npc1=this.matter.add.sprite(740,115,'npc1',null,{shape:{type:'rectangle',width:19.2,height:19},isStatic:true,friction:0.5,staticFriction:0.5,inertia: Infinity});
this.npc1.setDepth(9);
this.npc1.setScale(0.56);

// In your create() function:
this.zones = [
    this.matter.add.rectangle(152, 304, 210, 156, { 
        isStatic: true, 
        isSensor: true, 
        label: 'zoneA' 
    }),
    this.matter.add.rectangle(302, 527, 290, 60, { 
        isStatic: true, 
        isSensor: true, 
        label: 'zoneB' 
    }),
    this.matter.add.rectangle(88, 78, 175, 160, { 
        isStatic: true, 
        isSensor: true, 
        label: 'zoneC' 
    })
];
this.matter.world.createDebugGraphic();
this.currentZone = null;



cam.startFollow(this.hero); 

this.addToInventory("HEALTH_POTION","'../assetsWeapon/12.png'",'Restores full HP',1);
this.addToInventory("COSMIC_PICKAXE","'../assetsWeapon/1.png'",'Basic attack weapon',1);
this.addToInventory("FIRE_PICKAXE","'../assetsWeapon/2.png'",'Basic attack weapon',1);
this.addToInventory("GROUND_PICKAXE","'../assetsWeapon/3.png'",'Basic attack weapon',1);
this.addToInventory("ROCK_PICKAXE","'../assetsWeapon/4.png'",'Basic attack weapon',1);
this.addToInventory("FIRE_SWORD","'../assetsWeapon/5.png'",'Basic attack weapon',1);
this.addToInventory("ELECTRIC_SWORD","'../assetsWeapon/6.png'",'Basic attack weapon',1);
this.addToInventory("ROCK_SWORD","'../assetsWeapon/7.png'",'Basic attack weapon',1);
this.addToInventory("COSMIC_SWORD","'../assetsWeapon/8.png'",'Basic attack weapon',1);
this.addToInventory("COSMIC_SHEILD","'../assetsWeapon/9.png'",'Basic defence weapon',1);
this.addToInventory("FIRE_SHEILD","'../assetsWeapon/10.png'",'Basic defence weapon',1);
this.addToInventory("ROCK_SHEILD","'../assetsWeapon/11.png'",'Basic defence weapon',1);

 this.elementColors2 = {
  // Alkali Metals (violet tones)
  Li: "B22222", // firebrick
  Na: "0000FF", // blue
  K:  "0000FF",
  Rb: "9400D3", // dark violet
  Cs: "9400D3",

  // Alkaline Earth Metals (dark green)
  Be: "228B22",
  Mg: "228B22",
  Ca: "008000", // green
  Sr: "008000",
  Ba: "008000",

  // Transition Metals (silvery or gray/beige)
  Sc: "808090",
  Ti: "808090",
  V:  "808090",
  Cr: "808090",
  Mn: "808090",
  Fe: "FFA500", // rust-like orange
  Co: "808090",
  Ni: "808090",
  Cu: "A52A2A", // coppery brown
  Zn: "A52A2A",
  Y:  "808090",
  Zr: "808090",
  Nb: "808090",
  Mo: "808090",
  Ru: "808090",
  Rh: "808090",
  Pd: "808090",
  Ag: "C0C0C0", // silver
  Cd: "808090",
  Hf: "808090",
  Ta: "808090",
  W:  "808090",
  Re: "808090",
  Os: "808090",
  Ir: "808090",
  Pt: "808090",
  Au: "FFD700", // gold
  Hg: "A52A2A",
  
  // Other common elements
  Al: "808090", // aluminum (grayish)
  Si: "DAA520", // goldenrod
  P:  "FFA500", // orange
  S:  "FFC832", // yellow
  Cl: "00FF00", // green
  Br: "A52A2A", // brownish-red
  // Rare/metals defaults
  Ca: "008000",

  // Radioactives / actinides
  Th: "FF1493", // deep pink (others), per CPK default
  U:  "FF1493",
  Pu: "FF1493",
  Bi: "808090",
  Sb: "808090",
};
this.matter.world.on('collisionstart', () => {
    this.touched.play();
});
this.spaceBar=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // Input
    this.keys = this.input.keyboard.addKeys({
    LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
    RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    UP: Phaser.Input.Keyboard.KeyCodes.UP,
    DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
    ENTER: Phaser.Input.Keyboard.KeyCodes.ENTER,
    ESC: Phaser.Input.Keyboard.KeyCodes.ESC,
    I: Phaser.Input.Keyboard.KeyCodes.I
  });
   

        // Create inventory overlay (initially hidden)
       
this.interactionPrompt = this.add.text(720,99, 'Press ENTER', {
            font: '32px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setVisible(false).setScale(0.2).setAlpha(0.7);
         this.isCollidingWithNpc = false;
      

this.canJump = false;

this.matter.world.on('collisionactive', (event) => {
    event.pairs.forEach(pair => {
        if (pair.bodyA.gameObject === this.player || pair.bodyB.gameObject === this.player) {
            this.canJump = true;
        }
    });
});

this.matter.world.on('collisionend', () => {
    this.canJump = false;
});
const allBodies = this.matter.world.localWorld.bodies
this.spaceBar.on('down',async ()=>{
            if(this.img!=null){
              this.img.destroy();
            }
            if(this.msg!=null){
              this.msg.text.destroy();
           this.msg.overlay.destroy();
            }
            console.log('Space Bar Pressed!');
const collisions = Phaser.Physics.Matter.Matter.Query.collides(this.hero.body, allBodies);     
console.log(collisions);      
this.isInZone = this.checkZone();   
 if (this.isInZone || collisions.length == 0  ) {
           this.dig_sound.play('shortDig');
            if(this.msg){
             this.msg.text.destroy();
           this.msg.overlay.destroy();
            this.msg=null;}
                       
            console.log("Zone:",this.isInZone);
            this.canMove=false;
            this.hero.setVelocity(0,0);
            this.hero.anims.stop();
            
            if(this.lastAnim==='walk_up'){this.hero.play('attack_up',true);}
            if(this.lastAnim=='walk_down' ){this.hero.play('attack_down',true);}
            if(this.lastAnim=='walk_right'){this.hero.play('attack_right',true);}
            if(this.lastAnim=='walk_left'){this.hero.play('attack_left',true);}
            if(this.isInZone){
               
              console.log(this.isInZone);
               this.handleInsideZone();
              }
        
             else {
               
              console.log(this.isInZone);
              this.handleOUtsideZone(this);}
            this.time.delayedCall(500,()=>{this.canMove=true;
              console.log(this.canMove);
              if(this.lastAnim==='walk_up'){
              console.log("walking up");
            const holes=this.matter.add.sprite(this.hero.x,this.hero.y-12,'hole',null,{shape:{type: 'rectangle',width: 16,height: 12},isStatic:true,friction:0.7})
            holes.setDepth(8);
            }


            if(this.lastAnim=='walk_down' ){
              const holes=this.matter.add.sprite(this.hero.x,this.hero.y+18,'hole',null,{shape:{type: 'rectangle',width: 16,height: 12},isStatic:true,friction:0.7});
              holes.setDepth(8);
              this.time.delayedCall(60000,()=>{holes.destroy();})
            }
            if(this.lastAnim=='walk_right'){
              const holes =this.matter.add.sprite(this.hero.x+12,this.hero.y+10,'hole',null,{shape:{type: 'rectangle',width: 16,height: 12},isStatic:true,friction:0.7});
              holes.setDepth(8);
            }
            if(this.lastAnim=='walk_left'){
              const holes=this.matter.add.sprite(this.hero.x-12,this.hero.y+10,'hole',null,{shape:{type: 'rectangle',width: 16,height: 12},isStatic:true,friction:0.7});
              holes.setDepth(8);
            }
             
            
            });
          }
          else{
            console.log('Player is colliding with an object, cannot interact');
            console.log(this.isInZone)
          }
          }
);
//this.printAllAssets();
const collisionLayer = map.getObjectLayer('collision');
if(collisionLayer===null){
  console.log("encountered error");
  return;
}
this.collisionGroup = this.matter.world.nextGroup(true);

collisionLayer.objects.forEach(obj => {
  this.matter.add.rectangle(
    obj.x+obj.width/2,
    obj.y+obj.height/2 ,
    
    obj.width,
    obj.height,
    { isStatic: true,friction:0.3 }
  );
 
  
});


}
checkZone() {
    if (!this.hero || !this.zones || !this.matter.world) {
        console.warn("Missing required components for zone check");
        return null;
    }

    // Find first zone we're overlapping with
    const zone = this.zones.find(z => 
        this.matter.overlap(this.hero, z)
    );
    
    // Only log changes to avoid spam
    if (zone !== this.currentZone) {
        if (zone) {
            console.log(`Entered zone: ${zone.label}`);
        } else if (this.currentZone) {
            console.log(`Exited zone: ${this.currentZone.label}`);
        }
        this.currentZone = zone;
    }
    
    return zone?.label || false;
}

 async handleInsideZone(){
  let x=Phaser.Math.Between(1,2);
  //await requestRandomElements();
  //this.time.delayedCall(1000,async ()=>{
  if(x==1){
  this.msg= this.createText(this,"Congratulations you found an alloy",true);
  let tokenid;
  try {
  tokenid = await requestRandomElements();
  if (!tokenid) throw new Error("No data returned from requestRandomElements()");
} catch (err) {
  console.error("Error fetching tokenid:", err);
  return;
}

  console.log("Token ID:", tokenid);
  //console.log(tokenid.color1,tokenid.color2)
  this.loadCompoundImage(this,tokenid.elem1, tokenid.elem2, tokenid.moleFraction, tokenid.color1,tokenid.color2);
  const svg = this.buildSVG(tokenid.elem1, tokenid.elem2,tokenid.moleFraction, tokenid.color1,tokenid.color2);

// Convert to base64 data URI
const imageUri = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
await AssetManager.AssetHolder(
  'Alloy' + tokenid.tokenId,
  `Alloy ${tokenid.elem1}-${tokenid.elem2}_${tokenid.tokenId}`, 
  imageUri,
  `Formula: ${tokenid.elem1}-${tokenid.elem2} Mole fraction: ${tokenid.moleFraction}`, 
  tokenid.tokenId,                      
  1
)}
else{  this.msg= this.createText(this,"You didn't find anything try searching somewhere else",true);

// Convert to base64 data URI
}
}
async  debugLoad() {
  const walletAddress = await this.getWalletAddress();
  console.log("Trying to load from path:", `players/${walletAddress}/gold`);
  
  const snapshot = await firebase.database()
    .ref(`players/${walletAddress}/gold`)
    .once('value');
    
  console.log("Snapshot:", {
    exists: snapshot.exists(),
    val: snapshot.val(),
    path: snapshot.ref.toString()
  });
}
;
async  AssetHolder(_key, _name, _image, _description, _tokenId, _quantity) {
  try {
    const walletAddress = await this.getWalletAddress();
    if (!walletAddress) throw new Error("No wallet address available");

    const db = firebase.database();
    const assetRef = db.ref(`players/${walletAddress}/assets/${_key}`);

    // Check if asset exists
    const snapshot = await assetRef.once('value');
    
    if (!snapshot.exists()) {
      // Create new asset
      await assetRef.set({
        name: _name,
        image: _image,
        description: _description,
        tokenId: _tokenId,
        quantity: _quantity,
        owner: walletAddress.toLowerCase(),
        lastUpdated: Date.now()
      });
    } else {
      // Update existing asset
      const currentData = snapshot.val();
      await assetRef.update({
        quantity: currentData.quantity + _quantity,
        lastUpdated: Date.now()
      });
    }

    console.log(`Asset ${_key} saved to Firebase`);
    
    // Optional: Keep local cache updated
    this.updateLocalCache(walletAddress, _key, {
      name: _name,
      image: _image,
      description: _description,
      tokenId: _tokenId,
      quantity: snapshot.exists() ? snapshot.val().quantity + _quantity : _quantity
    });

  } catch (error) {
    console.error("Firebase save failed:", error);
    // Fallback to localStorage
    this.fallbackToLocalStorage(_key, _name, _image, _description, _tokenId, _quantity);
  }
}

// Helper functions
 updateLocalCache(walletAddress, key, assetData) {
  const cacheKey = `playerAssets_${walletAddress}`;
  const cache = JSON.parse(localStorage.getItem(cacheKey)) || {};
  cache[key] = assetData;
  localStorage.setItem(cacheKey, JSON.stringify(cache));
}

 fallbackToLocalStorage(_key, _name, _image, _description, _tokenId, _quantity) {
  const walletAddress = localStorage.getItem('lastWalletAddress');
  if (!walletAddress) return;

  const storageKey = `playerAssets_${walletAddress}`;
  const playerAssets = JSON.parse(localStorage.getItem(storageKey)) || {};
  
  if (!playerAssets[_key]) {
    playerAssets[_key] = {
      name: _name,
      image: _image,
      description: _description,
      tokenId: _tokenId,
      quantity: _quantity
    };
  } else {
    playerAssets[_key].quantity += _quantity;
  }

  localStorage.setItem(storageKey, JSON.stringify(playerAssets));
  console.warn('Used localStorage fallback for:', _key);
}

// Web3 functions
async  getWalletAddress() {
  if (!window.ethereum) {
    console.error("MetaMask not installed");
    throw new Error("No Ethereum provider");
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts available");
    }

    const address = accounts[0];
    
    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error("Invalid wallet address format");
    }

    return address.toLowerCase(); // Ensure lowercase
  } catch (error) {
    console.error("Failed to get wallet address:", error);
    throw error; // Re-throw for caller to handle
  }
}


// Call it wherever you need (e.g., after login)

async handleOUtsideZone(scene){
   const cam = scene.cameras.main;
      let x=Phaser.Math.Between(1,10);
      let w=Phaser.Math.Between(1,20);
  let y=Phaser.Math.Between(1,1000);
  let z=Phaser.Math.Between(1,1000000)
  this.time.delayedCall(1000,async ()=>{
  if(z==43729){
  this.msg=createText(this,"Congratulations!! You found the crown of a great king",true)
    this.img=this.add.image( cam.centerX,cam.centerY-20,'rare_crown');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
  const result = await mintReward("rare_crown")
  if (result.success) {
  await AssetManager.AssetHolder("Rare_Crown","Rare_Crown","../assetsFT/15.png","The crown of a great King",1,1);}
  }
else if (z == 263) {
    this.msg = this.createText(this, "Congratulations!! You found a rare red diamond", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'red_diamond');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("red_diamond");
    if (result.success) {
    await AssetManager.AssetHolder("Red_Diamond","Red Diamond","../assetsFT/6.png","A rare red diamond", 6,1
    );}
}
else if (z == 925492) {
    this.msg = this.createText(this, "Congratulations!! You found a rare blue diamond", true);
    this.img=this.add.image( cam.centerX,cam.centerY-20,'blue_diamond');
      this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("blue_diamond");
    if (result.success) {
    await AssetManager.AssetHolder("Blue_Diamond","Blue Diamond","../assetsFT/7.png","A rare blue diamond",7,1
    );}
}
else if(y==123){
    this.msg =this.createText(this, "Congratulations! You found a rose quartz", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'rose_quartz');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintRewardUI("rose_quartz");
    if (result.success) {
    AssetHolder("Rose_Quartz","Rose Quartz","../assetsFT/4.png","A beautiful rose quartz gem",4,1);}
  }
  else if(y==456) {
    this.msg = this.createText(this, "Great! You found a diamond", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'diamond'); 
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("diamond");
    if (result.success) {
    await AssetManager.AssetHolder("Diamond","Diamond","../assetsFT/5.png","A precious diamond gem",5,1);}
  }
else if (y == 468) {
    this.msg = this.createText(this, "Fantastic! You found a benitoite", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'benitoite');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("benitoite");
    if (result.success) {
    await AssetManager.AssetHolder("Benitoite","Benitoite","../assetsFT/1.png","A precious Benitoite gem", 1, 1
    );}
}
else if (y == 63) {
    this.msg = this.createText(this, "Amazing! You found a paintite", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'paintite');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("paintite");
    if (result.success) {
    AssetManager.AssetHolder("Paintite","Paintite","../assetsFT/2.png","A rare Paintite gem",2,1);
}}
else if (y == 964) {
    this.msg = this.createText(this, "Incredible! You found a serendibite", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'serendibite');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("serendibite");
    if (result.success) {
    await AssetManager.AssetHolder("Serendibite","Serendibite","../assetsFT/3.png","A rare Serendibite gem",3,1);
}}
else if (w == 3) {
    this.msg = this.createText(this, "Great! You found a bronze coin", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'bronze_coin');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("bronze_coin");
    if (result.success) {
    await AssetManager.AssetHolder("Bronze_Coin","Bronze Coin","../assetsFT/8.png","A simple bronze coin",8,1);
}}
else if (w == 6) {
    this.msg = this.createText(this, "Nice! You found a copper coin", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'copper_coin');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("copper_coin");
    if (result.success) {
    await AssetManager.AssetHolder("Copper_Coin", "Copper Coin", "../assetsFT/9.png", "A shiny copper coin", 9, 1
    );}
}
else if (y == 777) {
    this.msg = this.createText(this, "Amazing! You found a gold coin", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'gold_coin');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("gold_coin");
    if (result.success) {
    await AssetManager.AssetHolder("Gold_Coin","Gold Coin","../assetsFT/10.png","A valuable gold coin",10,1 );
}}
else if (y == 888) {
    this.msg = this.createText(this, "Awesome! You found a silver coin", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'silver_coin');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("silver_coin");
    if (result.success) {
    await AssetManager.AssetHolder("Silver_Coin","Silver Coin","../assetsFT/11.png","A shiny silver coin",11,1);
}}
else if (y == 901) {
    this.msg = this.createText(this, "Whoa! You found a crown", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'crown');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("crown");
    if (result.success) {
    AssetManager.AssetHolder("Crown","Crown","../assetsFT/12.png","A majestic crown",12,1
    );}
}
else if (w == 12) {
    this.msg = this.createText(this, "Whoa! You found a shard", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'shard');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("shard");
    if (result.success) {
    await AssetManager.AssetHolder("Shard","Shard","../assetsFT/13.png","A mysterious shard",13,1);
}}
else if (x == 4) {
    this.msg = this.createText(this, "Awesome! You found a bone", true);
      this.img=this.add.image( cam.centerX,cam.centerY-20,'bone');
        this.img.setOrigin(0.5);
      this.img.setDisplaySize(50, 50);
      this.img.setDepth(1000);
      this.img.setScrollFactor(0);
    const result =await mintReward("bone");
    if (result.success) {
   await AssetManager.AssetHolder("Bone","Bone","../assetsFT/14.png","A bone from ancient times",14,1);
}}

  else{
  this.msg= this.createText(this,"You didn't find anything try searching somewhere else",true);
  await AssetManager.AssetHolder("Bone","Bone","../assetsFT/14.png","A bone from ancient times",14,1);
  this.playerAssets=await AssetManager.loadPlayerAssets();
  console.log(this.playerAssets);
  this.img==null;
  
  //this.playerAssets = await AssetManager.loadPlayerAssets();
}})
  }
createText(scene, _text, _visible = true) {
  const cam = scene.cameras.main;
  
  // Create white overlay (rectangle covering the whole screen)
  const overlay = scene.add.rectangle(
    cam.centerX,
    cam.centerY,
    1000,
    1000,
    0xffffff, // White color
    0.5 // 50% opacity
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(999) // Just below the text
    .setVisible(_visible);

  // Create the text
  const text = scene.add.text(
    cam.centerX,
    cam.centerY + 65,
    _text,
    {
      fontFamily: "Arial",
      fontSize: "10px",
      color: "#ffffffff", // Changed to black for better contrast on white
      backgroundColor: "rgba(0, 0, 0, 1)", // Semi-transparent white
      padding: { left: 5, right: 5, top: 5, bottom: 5 },
      align: "center",
      fixedWidth: 390,
      wordWrap: { width: 200, useAdvancedWrap: true }
    }
  )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1000)
    .setAlpha(0.8)
    .setVisible(_visible);

  // Return both objects for later control
  return {
    text,
    overlay,
    setVisible: (visible) => {
      text.setVisible(visible);
      overlay.setVisible(visible);
    }
  };
}
   

 handleInventoryNavigation(time) {
    // Only process input if inventory is open
    if (!this.inventoryUI.isOpen) return;

   
        console.log('Keys:', {
    LEFT: this.keys.LEFT.isDown,
    RIGHT: this.keys.RIGHT.isDown,
    UP: this.keys.UP.isDown,
    DOWN: this.keys.DOWN.isDown,
    ENTER: this.keys.ENTER.isDown,
    ESC: this.keys.ESC.isDown
  });
    // Check for navigation input with proper debouncing
    if (Phaser.Input.Keyboard.JustDown(this.keys.LEFT) && time - this.lastMoveTime > this.moveDelay) {
      this.menusound.play();
      this.inventoryUI.moveSelection(-1);
      this.lastMoveTime = time;
    }
    else if (Phaser.Input.Keyboard.JustDown(this.keys.RIGHT) && time - this.lastMoveTime > this.moveDelay) {
      this.menusound.play();
      this.inventoryUI.moveSelection(1);
      this.lastMoveTime = time;
    }
    else if (Phaser.Input.Keyboard.JustDown(this.keys.UP) && time - this.lastMoveTime > this.moveDelay) {
      this.menusound.play();
      this.inventoryUI.moveSelection(-6); // Move up a row
      this.lastMoveTime = time;
    }
    else if (Phaser.Input.Keyboard.JustDown(this.keys.DOWN) && time - this.lastMoveTime > this.moveDelay) {
      this.menusound.play();
      this.inventoryUI.moveSelection(6); // Move down a row
      this.lastMoveTime = time;
    }
    else if (Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) {
      this.menusound.play();
      this.inventoryUI.mintItem(this.inventoryUI.selectedIndex);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
      this.menusound.play();
      this.inventoryUI.toggle();
    }
  }



  toggleInventory() {
    this.menusound.play();
    this.inventoryUI.toggle();
    this.matter.world.paused = this.inventoryUI.isOpen;
  }

  addToInventory(name, texture, description, quantity = 1) {
    this.inventoryUI.addToInventory(name, texture, description, quantity);
  }

 buildSVG(elem1, elem2, moleFraction, color1, color2) {
  const moleText = moleFraction.toString();
  return `
    <svg width="50" height="50" viewBox="0 0 50 50" 
         shape-rendering="crispEdges" text-rendering="optimizeLegibility" 
         xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#${color1}"/>
          <stop offset="100%" stop-color="#${color2}"/>
        </linearGradient>
      </defs>
      <rect width="50" height="50" fill="url(#g)" stroke="#000" stroke-width="1"/>
      <text x="4" y="10" font-size="8" fill="#000" 
            font-family="Arial, sans-serif" 
            dominant-baseline="hanging">${elem1}</text>
      <text x="46" y="46" font-size="8" fill="#000" 
            text-anchor="end" dominant-baseline="auto"
            font-family="Arial, sans-serif">${elem2}</text>
      <text x="25" y="30" font-size="14" fill="#000" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="Arial, sans-serif" font-weight="bold">${moleText}</text>
    </svg>`;
}
async loadCompoundImage(scene, e1, e2, mf, c1, c2) {
    // 1. Generate a larger SVG (4x the display size for crisp downscaling)
    const svg = this.buildSVG(e1, e2, mf, c1, c2);
    const dataUri = this.svgToDataUri(svg);
    const key = `compound${Date.now()}`;
    const cam = scene.cameras.main;  

    // 2. Load the texture with precise scaling
    this.textures.addBase64(key, dataUri);
    this.textures.once('addtexture-' + key, () => {
        // 3. Create image with exact pixel dimensions
        this.img = this.add.image(
            Math.floor(cam.centerX),  // Snap to pixel grid
            Math.floor(cam.centerY - 20),
            key
        );
        
        // 4. Configure for crisp rendering
        this.img.setOrigin(0.5, 0.5);
        this.img.setDisplaySize(30, 30);  // Must match your intended display size
        this.img.setDepth(1000);
        this.img.setScrollFactor(0);
        
        // 5. Force integer pixel positioning
        this.img.setPosition(
            Math.floor(this.img.x),
            Math.floor(this.img.y)
        );
        
        // 6. Enable texture filtering (if using WebGL)
        if (this.img.texture) {
            this.img.texture.setFilter(Phaser.Textures.NEAREST);
        }
    });
}
  svgToDataUri(svg) {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

async  update() {
  if (!this.keys || !this.keys.ENTER) {
        console.warn("Keyboard inputs not properly initialized");
        return;
    }

          const collisions = this.matter.query.collides(this.hero.body, [this.npc1.body]);
        this.isCollidingWithNpc = collisions.length > 0;
     if(this.isCollidingWithNpc){
      console.log("Colliding with NPC",this.interactionPrompt.x, 
  this.interactionPrompt.y);
    this.interactionPrompt.setVisible(true).setDepth(4000);
  }else{this.interactionPrompt.setVisible(false);}
if (this.isCollidingWithNpc && Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) {
    console.log("Interacting with NPC");
    if (!this.inventoryUI.isOpen) { 
        
        this.menusound.play(); 
        this.toggleInventory();
        console.log("canMove:", this.canMove, "inventoryOpen:", this.inventoryUI.isOpen);
       
    }
}
        if(Phaser.Input.Keyboard.JustDown(this.keys.ENTER)&&this.msg){
          this.msg.text.destroy();
           this.msg.overlay.destroy();
           if(this.img){
        this.img.destroy();}
        }
    
  

  if(this.canMove==false || this.inventoryUI.isOpen){
    this.hero.setVelocity(0,0);
    
    return;
  }
    const dir = new Phaser.Math.Vector2();
    const SPEED=3;
    if (this.keys.LEFT.isDown)  dir.x = -1;
    else if (this.keys.RIGHT.isDown) dir.x = 1;
    else if (this.keys.UP.isDown)    dir.y = -1;
    else if (this.keys.DOWN.isDown) dir.y = 1;

    if (dir.lengthSq() === 0) {
    // Player is not moving
    this.hero.setVelocity(0);
    
    if (this.currentAnim) {
        this.hero.stop();  
        this.lastAnim = this.currentAnim; 
        this.currentAnim = null;
    }
} else {
    // Player is moving
    dir.normalize();
    this.hero.setVelocity(dir.x * SPEED, dir.y * SPEED);

    const animName = dir.y > 0 ? 'walk_down'
                    : dir.y < 0 ? 'walk_up'
                    : dir.x > 0 ? 'walk_right'
                    : 'walk_left';

    if (this.currentAnim !== animName) {
        
        this.lastAnim = this.currentAnim || 'idle';
        this.currentAnim = animName; 
        this.hero.play(animName, true);
    }
    else{
      this.lastAnim=animName;
    }
}
      console.log(this.lastAnim);
   
 

  }



}
console.log("CONTRACT_ADDRESS:", CONTRACT_ADDRESS);

console.log("ABI defined?", !!GameFTs_ABI);
console.log("ABI has 'mint'?", GameFTs_ABI.some(f => f.name === "mint"));
async function mintReward(itemName) {
  try {
    // Show initial minting status
    mintPopup.show("Initializing reward minting...", false);

    // 1️⃣ Check Ethereum provider
    if (!window.ethereum) {
      throw new Error("MetaMask not installed!");
    }

    // 2️⃣ Connect wallet
    mintPopup.show("Connecting wallet...", false);
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    const walletAddress = accounts[0];

    if (!ethers.isAddress(walletAddress)) {
      throw new Error("Invalid wallet address");
    }

    // 3️⃣ Set up provider and contracts
    mintPopup.show("Preparing contracts...", false);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, GameFTs_ABI, signer);

    // 4️⃣ Determine token ID
    const name = itemName.toLowerCase();
    const tokenMap = {
      "benitoite": 1,
      "paintite": 2,
      "serendibite": 3,
      "rose_quartz": 4,
      "diamond": 5,
      "red_diamond": 6,
      "blue_diamond": 7,
      "bronze_coin": 8,
      "copper_coin": 9,
      "gold_coin": 10,
      "silver_coin": 11,
      "crown": 12,
      "shard": 13,
      "bone": 14,
      "rare_crown": 15
    };

    const tokenId = tokenMap[name];
    if (!tokenId) {
      throw new Error(`Unknown item: ${itemName}`);
    }

    // 5️⃣ Execute mint
    mintPopup.show("Confirm mint in your wallet...", false);
    const tx = await contract.mint(walletAddress, tokenId, 1);
    mintPopup.show("Processing transaction...", false);
    console.log(tx.hash);

    // Manual receipt fetching with timeout
    const receipt = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Transaction timeout")), 60000); // 60 seconds timeout

      const checkReceipt = async () => {
        const fetchedReceipt = await provider.getTransactionReceipt(tx.hash);
        if (fetchedReceipt) {
          clearTimeout(timeout);
          resolve(fetchedReceipt);
        } else {
          setTimeout(checkReceipt, 5000); // Retry every 5 seconds
        }
      };

      checkReceipt();
    });

    console.log("Transaction receipt:", receipt);

    // 6️⃣ Verify mint success
    if (receipt.status === 1) {
      mintPopup.show(`Successfully minted ${itemName}!`, true);
      console.log("✅ Mint successful! TX:", receipt.transactionHash);
      return { success: true, txHash: tx.hash };
    } else {
      throw new Error("Transaction failed");
    }

  } catch (error) {
    console.error("❌ Mint Error:", error);

    // User-friendly error messages
    let errorMsg = "Minting failed";
    if (error.message.includes("user rejected transaction")) {
      errorMsg = "Transaction canceled by user";
    } else if (error.message.includes("execution reverted")) {
      errorMsg = "Contract rejected transaction";
    } else {
      errorMsg = error.message;
    }

    mintPopup.show(errorMsg, true); // Show error with OK button
    return { success: false, error: errorMsg };
  }
}
  async function requestRandomElements() {
  try {
    mintPopup.show("Initializing element request...", false);

    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    mintPopup.show("Connecting wallet...", false);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    if (!ethers.isAddress(MOCK_VRF_ADDRESS) || !ethers.isAddress(CONTRACT_ADDRESS4)) {
      throw new Error("Invalid contract addresses");
    }

    mintPopup.show("Preparing contracts...", false);
    const vrfMock = new ethers.Contract(
      MOCK_VRF_ADDRESS,
      VRF_COORDINATOR_ABI,
      signer
    );
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS4,
      RANDOM_ELEMENTS_ABI,
      signer
    );

    mintPopup.show("Requesting random elements...", false);
    const tx = await contract.requestAll();
    const receipt = await tx.wait();
    
    const reqLog = receipt.logs.find(log => {
      try {
        return contract.interface.parseLog(log)?.name === "RequestSent";
      } catch {
        return false;
      }
    });
    
    if (!reqLog) throw new Error("RequestSent event not found");

    const requestId = reqLog.args.requestId;
    mintPopup.show("Generating elements...", false);
    
    const fulfillTx = await vrfMock.fulfillRandomWords(requestId, CONTRACT_ADDRESS4);
    await fulfillTx.wait();

    mintPopup.show("Retrieving results...", false);
    const [elem1, elem2, frac] = await contract.getResult();
    if (!elem1 || !elem2 || frac === undefined) {
      throw new Error("Invalid elements returned");
    }
    
    const moleFraction = Number(frac);
    
  const elementColors = {
  // Alkali Metals (violet tones)
  Li: "B22222", // firebrick
  Na: "0000FF", // blue
  K:  "0000FF",
  Rb: "9400D3", // dark violet
  Cs: "9400D3",

  // Alkaline Earth Metals (dark green)
  Be: "228B22",
  Mg: "228B22",
  Ca: "008000", // green
  Sr: "008000",
  Ba: "008000",

  // Transition Metals (silvery or gray/beige)
  Sc: "808090",
  Ti: "808090",
  V:  "808090",
  Cr: "808090",
  Mn: "808090",
  Fe: "FFA500", // rust-like orange
  Co: "808090",
  Ni: "808090",
  Cu: "A52A2A", // coppery brown
  Zn: "A52A2A",
  Y:  "808090",
  Zr: "808090",
  Nb: "808090",
  Mo: "808090",
  Ru: "808090",
  Rh: "808090",
  Pd: "808090",
  Ag: "C0C0C0", // silver
  Cd: "808090",
  Hf: "808090",
  Ta: "808090",
  W:  "808090",
  Re: "808090",
  Os: "808090",
  Ir: "808090",
  Pt: "808090",
  Au: "FFD700", // gold
  Hg: "A52A2A",
  
  // Other common elements
  Al: "808090", // aluminum (grayish)
  Si: "DAA520", // goldenrod
  P:  "FFA500", // orange
  S:  "FFC832", // yellow
  Cl: "00FF00", // green
  Br: "A52A2A", // brownish-red
  // Rare/metals defaults
  Ca: "008000",

  // Radioactives / actinides
  Th: "FF1493", // deep pink (others), per CPK default
  U:  "FF1493",
  Pu: "FF1493",
  Bi: "808090",
  Sb: "808090",
};
    // 6. Mint and return values
     mintPopup.show("Preparing to mint alloy...", false);
   const values = await mintCompoundNFT(elem1, elem2, moleFraction, elementColors[elem1], elementColors[elem2]);
    
    if (!values?.tokenId) {
      throw new Error("Minting failed - no tokenId returned");
    }
    
    mintPopup.show("Compound NFT created successfully!", true);
    return values;

  } catch (err) {
    console.error("Error:", err);
    const errorMsg = err.message.includes("user rejected transaction") 
      ? "Transaction canceled" 
      : err.message.includes("execution reverted") 
        ? "Contract rejected transaction" 
        : `Request failed: ${err.message}`;
    
    mintPopup.show(errorMsg, true);
    throw err;
  }
}
async function mintCompoundNFT(elem1, elem2, moleFraction, color1, color2) {
  try {
    mintPopup.show("Initializing compound mint...", false);

    // 1. Request wallet access
    mintPopup.show("Connecting wallet...", false);
    const [walletAddress] = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    if (!ethers.isAddress(walletAddress)) {
      throw new Error("Invalid wallet address");
    }

    // 2. Set up provider and signer
    mintPopup.show("Preparing contracts...", false);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // 3. Instantiate the contract
    const contract = new ethers.Contract(
      ALLOY_ADDRESS,
      ALLOY_ABI,
      signer
    );

    // 4. Validate arguments
    if (typeof elem1 !== 'string' || typeof elem2 !== 'string') {
      throw new Error("Element symbols must be strings");
    }
    if (typeof moleFraction !== 'number' || isNaN(moleFraction)) {
      throw new Error("Invalid mole fraction");
    }
    if (!/^[0-9A-Fa-f]{6}$/.test(color1) || !/^[0-9A-Fa-f]{6}$/.test(color2)) {
      throw new Error("Colors must be 6-character hex strings without #");
    }

    // 5. Call mint()
    mintPopup.show("Confirm mint in your wallet...", false);
    const tx = await contract.mint(
      walletAddress,
      elem1,
      elem2,
      moleFraction,
      color1,
      color2
    );

    mintPopup.show("Processing transaction...", false);
    const receipt = await tx.wait();
    
    // Find Transfer event
    const transferEvent = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === "Transfer";
      } catch {
        return false;
      }
    });

    if (!transferEvent) {
      throw new Error("Transfer event not found in receipt");
    }

    const tokenId = transferEvent.args[2].toString();
    mintPopup.show(`Success! NFT ID: ${tokenId}`, true);

    return { 
      tokenId, 
      elem1, 
      elem2, 
      moleFraction, 
      color1, 
      color2 
    };

  } catch (err) {
    console.error("Mint Error:", err);
    
    let errorMsg = "Minting failed";
    if (err.message.includes("user rejected transaction")) {
      errorMsg = "Transaction canceled";
    } else if (err.reason) {
      errorMsg = err.reason;
    } else if (err.message) {
      errorMsg = err.message;
    }

    mintPopup.show(errorMsg, true);
    throw err;
  }
}

const config ={
    type: Phaser.AUTO,
   width: window.innerWidth,
   height: window.innerHeight,
   debugger: true,
    render: {
    pixelArt: true,
    roundPixels: true,
    mipmapFilter: 'LINEAR_MIPMAP_LINEAR'
  },
    scale: {
    mode: Phaser.Scale.FIT,
   width: window.innerWidth,
   height: window.innerHeight,
    
  },
  input: {
    mouse: {
      preventDefaultWheel: false  
    }},
    physics:{
        default: 'matter',
    matter: { debug: {
      showBody: false,
      showStaticBody: false,
     timing: {
                timeScale: 1,     
                delta: 16.666    
            }} ,
      
      }
    },
    scene:  [WorldScene] 
};
new Phaser.Game(config);


class InventoryUI {
  constructor(scene) {
    this.scene = scene;
    this.overlay = document.getElementById('inventory-overlay');
    this.grid = document.getElementById('inventory-grid');
    this.closeButton = document.querySelector('.close-inventory');
    this.items = [];
    this.selectedIndex = 0;
    this.isOpen = false;

    
    this.closeButton.addEventListener('click', () => this.toggle());
    
    
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.toggle();
      }
    });

    
    this.overlay.style.display = 'none';
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    if (this.isOpen) return;
    
    this.overlay.style.display = 'flex';
    this.isOpen = true;
    this.refreshDisplay();
    
    
    this.scene.scene.pause();
    this.scene.input.keyboard.enabled = false;
    
   
    if (this.scene.matter?.world) {
      this.scene.matter.world.paused = true;
    }
    
    
    if (this.scene.hero?.body) {
      this.scene.hero.setVelocity(0, 0);
    }
    
   
    if (this.scene.menusound) {
      this.scene.menusound.play();
    }
  }

  hide() {
    if (!this.isOpen) return;
    
    this.overlay.style.display = 'none';
    this.isOpen = false;
    
    this.scene.scene.resume();
    this.scene.input.keyboard.enabled = true;
    
    if (this.scene.matter?.world) {
      this.scene.matter.world.paused = false;
    }
    
    if (this.scene.menusound) {
      this.scene.menusound.play();
    }
  }

  addToInventory(name, texture, description, quantity = 1) {
    this.items.push({ name, texture, description, quantity });
  }

  refreshDisplay() {
    this.grid.innerHTML = '';
    
    this.items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = `inventory-item ${index === this.selectedIndex ? 'selected' : ''}`;
      itemElement.dataset.index = index;
      
      const imgElement = document.createElement('img');
      imgElement.src = item.texture.replace(/'/g, '');
      imgElement.alt = item.name;
      imgElement.className = 'inventory-img';
      
      imgElement.onerror = () => {
        console.error(`Failed to load image: ${item.texture}`);
        imgElement.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="red"><text x="12" y="12" font-size="12" text-anchor="middle" dominant-baseline="middle">?</text></svg>';
      };
      
      itemElement.innerHTML = `
        <div class="inventory-item-name">${item.name}</div>
        <div class="inventory-item-quantity">x${item.quantity}</div>
        <button class="mint-btn">MINT</button>
      `;
      
      itemElement.insertBefore(imgElement, itemElement.firstChild);
      
      itemElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('mint-btn')) {
          e.stopPropagation();
          this.mintItem(index);
        } else {
          this.selectItem(index);
        }
      });
      
      this.grid.appendChild(itemElement);
    });
  }

  selectItem(index) {
    const prevSelected = document.querySelector('.inventory-item.selected');
    if (prevSelected) prevSelected.classList.remove('selected');
    
    this.selectedIndex = index;
    const newSelected = document.querySelector(`.inventory-item[data-index="${index}"]`);
    if (newSelected) newSelected.classList.add('selected');
  }

  moveSelection(change) {
    const newIndex = this.selectedIndex + change;
    if (newIndex >= 0 && newIndex < this.items.length) {
      this.selectItem(newIndex);
    }
  }

async mintItem(index) {
  try {
    // Get the selected item from inventory
    const selectedItem = this.items[index];
    if (!selectedItem) {
      throw new Error("No item selected");
    }

    // Show initial minting status
    mintPopup.show(`Starting mint of ${selectedItem.name}...`, false);

    // 1️⃣ Check Ethereum provider
    if (!window.ethereum) {
      throw new Error("MetaMask not installed!");
    }

    // 2️⃣ Connect wallet
    mintPopup.show("Connecting wallet...", false);
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    const walletAddress = accounts[0];
    
    if (!ethers.isAddress(walletAddress)) {
      throw new Error("Invalid wallet address");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
  
  mintPopup.show("Preparing contracts...", false);
    const bdag = new ethers.Contract(BDAG_ADDRESS, ERC20_ABI, signer);
    const game = new ethers.Contract(CONTRACT_ADDRESS3, WEAPONS_ABI, signer);
    console.log("Using contract address:", CONTRACT_ADDRESS3);
const network = await provider.getNetwork();
console.log("Connected chain ID:", network.chainId);
const bytecode = await provider.getCode(CONTRACT_ADDRESS3);
console.log("Contract bytecode:", bytecode);

    // 4️⃣ Map item names to token IDs
    const itemMap = {
      "COSMIC_PICKAXE": 1,
      "FIRE_PICKAXE": 2,
      "GROUND_PICKAXE": 3,
      "ROCK_PICKAXE": 4,
      "FIRE_SWORD": 5,
      "ELECTRIC_SWORD": 6,
      "ROCK_SWORD": 7,
      "COSMIC_SWORD": 8,
      "COSMIC_SHEILD": 9,
      "FIRE_SHEILD": 10,
      "ROCK_SHEILD": 11,
      "HEALTH_POTION": 12
    };

    // Convert item name to uppercase key
    const itemKey = selectedItem.name.toUpperCase();
    const tokenId = itemMap[itemKey];
    if (!tokenId) {
      throw new Error(`Unknown item: ${selectedItem.name}`);
    }

    // 5️⃣ Get minting cost
    mintPopup.show("Calculating minting cost...", false);
    let cost;
try {
   cost = await game.getMintCost();
  console.log("Mint cost:", cost.toString());
} catch (error) {
  console.error("Error calling getMintCost:", error);
}    const totalCost = cost; // For single mint (amount = 1)

    // 6️⃣ Check BDAG balance
    mintPopup.show("Checking token balance...", false);
    const balance = await bdag.balanceOf(walletAddress);
    if (balance < totalCost) {
      throw new Error(`Insufficient BDAG balance. Needed: ${ethers.formatUnits(totalCost)}`);
    }

    // 7️⃣ Check and set allowance
    mintPopup.show("Checking token allowance...", false);
    const allowance = await bdag.allowance(walletAddress, CONTRACT_ADDRESS3);
    if (allowance < totalCost) {
      mintPopup.show("Approving token transfer...", false);
      const approveTx = await bdag.approve(CONTRACT_ADDRESS3, totalCost);
      await approveTx.wait();
    }

    // 8️⃣ Execute mint
    mintPopup.show("Confirm mint in your wallet...", false);
    const mintTx = await game.mint(walletAddress, tokenId, 1);
    mintPopup.show("Processing transaction...", false);
    const receipt = await mintTx.wait();

    // 9️⃣ Verify mint success
    if (receipt.status === 1) {
      mintPopup.show(`Successfully minted ${selectedItem.name}!`, true);
      
      // Add to asset manager
      const assetMap = {
        12: ['health_potion','Health Potion','../assetsWeapon/12.png','Recovers complete health',12,1],
        1: ['cosmic_pickaxe','Cosmic Pickaxe','../assetsWeapon/1.png','A powerful pickaxe with cosmic energy',2,1],
        2: ['fire_pickaxe','Fire Pickaxe','../assetsWeapon/2.png','A pickaxe imbued with the power of fire',2,1],
        3: ['ground_pickaxe','Ground Pickaxe','../assetsWeapon/3.png','A sturdy pickaxe for mining',3,1],
        4: ['rock_pickaxe','Rock Pickaxe','../assetsWeapon/4.png','A pickaxe designed for breaking rocks',4,1],
        5: ['fire_sword','Fire Sword','../assetsWeapon/5.png','A sword with flames that burn enemies',5,1],
        6: ['electric_sword','Electric Sword','../assetsWeapon/6.png','A sword that shocks enemies with electricity',6,1],
        7: ['rock_sword','Rock Sword','../assetsWeapon/7.png','A sword made of solid rock',7,1],
        8: ['cosmic_sword','Cosmic Sword','../assetsWeapon/8.png','A sword with cosmic energy that cuts through anything',8,1],
        9: ['cosmic_sheild','Cosmic Sheild','../assetsWeapon/9.png','A shield that protects against cosmic attacks',9,1],
        10: ['fire_sheild','Fire Sheild','../assetsWeapon/10.png','A shield that protects against fire attacks',10,1],
        11: ['rock_sheild','Rock Sheild','../assetsWeapon/11.png','A shield made of solid rock that protects against physical attacks',11,1]
      };

      if (assetMap[tokenId]) {
        await AssetManager.AssetHolder(...assetMap[tokenId]);
      }
      
      console.log("Asset holder:", window.playerAssets);
      return true;
    } else {
      throw new Error("Transaction failed");
    }

  } catch (error) {
    console.error("❌ Mint Error:", error);
    
    // User-friendly error messages
    let errorMsg = "Minting failed";
    if (error.message.includes("user rejected transaction")) {
      errorMsg = "Transaction canceled by user";
    } else if (error.message.includes("insufficient funds")) {
      errorMsg = "Insufficient BDAG balance";
    } else if (error.message.includes("execution reverted")) {
      errorMsg = "Contract rejected transaction";
    } else {
      errorMsg = error.message;
    }

    mintPopup.show(errorMsg, true);
    return false;
  }
}
}
