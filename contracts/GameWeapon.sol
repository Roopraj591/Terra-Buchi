// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameWeapon is ERC1155, Ownable {
    using Strings for uint256;
    IERC20 public immutable bdag;  // Made immutable for deployment savings
    uint256 public costPerMint;
     string private baseURI;

    // Packed constants into a single bytes32 for storage efficiency
    bytes32 private constant ITEM_NAMES = keccak256("COSMIC_PICKAXE,FIRE_PICKAXE,GROUND_PICKAXE,ROCK_PICKAXE,FIRE_SWORD,ELECTRIC_SWORD,ROCK_SWORD,COSMIC_SWORD,COSMIC_SHEILD,FIRE_SHEILD,ROCK_SHEILD,HEALTH_POTION");
    
    // Using uint8 for IDs since we only have 12 items
    uint8 public constant MIN_ID = 1;
    uint8 public constant MAX_ID = 12;

    constructor(
        address _bdagToken,
        uint256 _costPerMint
    ) ERC1155("") Ownable(msg.sender) {
        bdag = IERC20(_bdagToken);
        costPerMint = _costPerMint;
        baseURI ="https://ipfs.io/ipfs/bafybeibuhxg24vcsznbua7dok3yusgxxer3idq27vvkv34z6y7j62hinua/";
    }

    function mint(address to, uint256 id, uint256 amount) external {
        require(id >= MIN_ID && id <= MAX_ID, "Invalid token ID");
        require(amount > 0, "Amount must be positive");
        uint256 cost = costPerMint * amount;
        
        
        // Optimized transfer flow to save gas
        bool success = bdag.transferFrom(msg.sender, address(this), cost);
        require(success, "Payment failed");
        
        _mint(to, id, amount, "");
    }
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI,  tokenId.toString(), ".json"));
    }

    function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts) external onlyOwner {
        // Using calldata instead of memory for arrays
        _mintBatch(to, ids, amounts, "");
    }

    function setURI(string calldata newuri) external onlyOwner {
        // Using calldata instead of memory for string
        _setURI(newuri);
    }

    function setCost(uint256 newCost) external onlyOwner {
        costPerMint = newCost;
    }

    function withdrawBDAG(address to) external onlyOwner {
        uint256 bal = bdag.balanceOf(address(this));
        bool success = bdag.transfer(to, bal);
        require(success, "Withdraw failed");
    }

    function getMintCost() external view returns (uint256) {
        return costPerMint;
    }
} 