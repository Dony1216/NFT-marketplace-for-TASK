// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, ERC721Enumerable, ERC2981, Ownable {
    uint256 public tokenCount;

    uint256 public mintFee = 0.01 ether;
    uint256 public mintCooldown = 5 minutes;

    mapping(address => uint256) public lastMintTime;

    event Minted(address indexed owner, uint256 indexed tokenId, string tokenURI);

    constructor(
        address initialOwner,
        address royaltyReceiver,
        uint96 royaltyFee
    ) ERC721("MyNFT", "MNFT") Ownable(initialOwner) {
        _setDefaultRoyalty(royaltyReceiver, royaltyFee);
    }

    function mint(string memory uri) external payable returns (uint256) {
        require(msg.value >= mintFee, "Mint fee required");
        require(block.timestamp >= lastMintTime[msg.sender] + mintCooldown, "Mint cooldown active");

        lastMintTime[msg.sender] = block.timestamp;

        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, uri);

        emit Minted(msg.sender, tokenCount, uri);
        return tokenCount;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /* ================= OVERRIDES (OZ v5) ================= */

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC721Enumerable, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 amount
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
