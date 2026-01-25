// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 public tokenCount;

    // 🔒 Anti-spam
    uint256 public mintFee = 0.01 ether;
    uint256 public mintCooldown = 5 minutes;

    mapping(address => uint256) public lastMintTime;

    event Minted(
        address indexed owner,
        uint256 indexed tokenId,
        string tokenURI
    );

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

    // 🧠 MAIN MINT FUNCTION
    function mint(string memory _uri) external payable returns (uint256) {
        // 1️⃣ Mint fee check
        require(msg.value >= mintFee, "Mint fee required");

        // 2️⃣ Cooldown check
        require(
            block.timestamp >= lastMintTime[msg.sender] + mintCooldown,
            "Mint cooldown active"
        );

        // 3️⃣ Update cooldown
        lastMintTime[msg.sender] = block.timestamp;

        // 4️⃣ Mint NFT
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _uri);

        emit Minted(msg.sender, tokenCount, _uri);

        return tokenCount;
    }

    // 💰 Withdraw collected mint fees
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function canMint(address user) external view returns (bool) {
        return block.timestamp >= lastMintTime[user] + mintCooldown;
    }    

    // // ⚙️ Admin settings
    // function setMintFee(uint256 _fee) external onlyOwner {
    //     mintFee = _fee;
    // }

    // function setMintCooldown(uint256 _cooldown) external onlyOwner {
    //     mintCooldown = _cooldown;
    // }
}
