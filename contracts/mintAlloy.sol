// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract CompoundSVGNFT is ERC721URIStorage {
    using Strings for uint256;

    uint256 public nextId;
    address public owner;

    constructor() ERC721("CompoundSVGNFT", "CMPDSVG") {
        owner = msg.sender;
    }

    function mint(
        address to,
        string memory elem1,
        string memory elem2,
        uint256 moleFrac,
        string memory color1,
        string memory color2
    ) external {
        require(msg.sender == owner, "Only owner can mint");
        uint256 tokenId = ++nextId;
        _safeMint(to, tokenId);
        string memory uri = buildTokenURI(elem1, elem2, moleFrac, color1, color2);
        _setTokenURI(tokenId, uri);
    }

    function buildTokenURI(
        string memory elem1,
        string memory elem2,
        uint256 moleFrac,
        string memory color1,
        string memory color2
    ) public pure returns (string memory) {
        string memory svg = string.concat(
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
              '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#',color1,'"/>',
                '<stop offset="100%" stop-color="#',color2,'"/>',
              '</linearGradient></defs>',
              '<rect x="0" y="0" width="400" height="400" fill="url(#g)" stroke="#000" stroke-width="8"/>',
              '<text x="20" y="40" font-size="32" fill="#000" text-anchor="start" dominant-baseline="hanging">',elem1,'</text>',
              '<text x="380" y="380" font-size="32" fill="#000" text-anchor="end" dominant-baseline="text-after-edge">',elem2,'</text>',
              '<text x="200" y="200" font-size="64" fill="#000" text-anchor="middle" dominant-baseline="middle">',moleFrac.toString(),'</text>',
            '</svg>'
        );

        string memory img = string.concat(
            "data:image/svg+xml;base64,",
            Base64.encode(bytes(svg))
        );

        string memory json = Base64.encode(
            bytes(
              string.concat(
                '{"name":"Compound",',
                '"description":"On-chain compound NFT",',
                '"image":"', img, '"}'
              )
            )
        );

        return string.concat("data:application/json;base64,", json);
    }
}