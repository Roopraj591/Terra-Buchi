// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 

contract GameFTs is ERC1155, Ownable {
    using Strings for uint256; // Enable .toString() for tokenId

    uint8 public constant MIN_ID = 1;
    uint8 public constant MAX_ID = 15;
    string public baseURI; 

    constructor() ERC1155("") Ownable(msg.sender) {
        baseURI = "https://ipfs.io/ipfs/bafybeic3fnw5ivkj6rngkcn2qjmxrjv5s7kf5ye27bydddpffwbpmquwzq/";
    }

    function mint(address to, uint256 id, uint256 amount) external onlyOwner {
        require(id >= MIN_ID && id <= MAX_ID, "Invalid token ID");
        _mint(to, id, amount, "");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts) external onlyOwner {
        for (uint256 i = 0; i < ids.length; i++) {
            require(ids[i] >= MIN_ID && ids[i] <= MAX_ID, "Invalid token ID");
        }
        _mintBatch(to, ids, amounts, "");
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }
}