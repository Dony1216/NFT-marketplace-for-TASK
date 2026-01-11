// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Marketplace {
    struct Listing {
        address seller;
        uint256 price;
        address nft;
        uint256 tokenId;
    }

    Listing[] public allListings;

    mapping(address => mapping(uint256 => uint256)) public listingIndex;

    function listItem(
        address nft,
        uint256 tokenId,
        uint256 price
    ) external {
        require(price > 0, "Price must be > 0");

        IERC721(nft).transferFrom(msg.sender, address(this), tokenId);

        allListings.push(Listing(msg.sender, price, nft, tokenId));
        listingIndex[nft][tokenId] = allListings.length - 1;
    }

    function buyItem(uint256 index) external payable {
        Listing memory item = allListings[index];
        require(msg.value == item.price, "Wrong ETH");

        // 1️⃣ Pay seller
        (bool success, ) = payable(item.seller).call{value: msg.value}("");
        require(success, "ETH transfer failed");

        // 2️⃣ Transfer NFT to buyer
        IERC721(item.nft).transferFrom(
            address(this),
            msg.sender,
            item.tokenId
        );

        // 3️⃣ Remove listing LAST
        allListings[index] = allListings[allListings.length - 1];
        allListings.pop();
    }


    function cancelListing(uint256 index) external {
        Listing memory item = allListings[index];
        require(item.seller == msg.sender, "Not seller");

        IERC721(item.nft).transferFrom(
            address(this),
            item.seller,
            item.tokenId
        );

        allListings[index] = allListings[allListings.length - 1];
        allListings.pop();
    }

    function getAllListings() external view returns (Listing[] memory) {
        return allListings;
    }


}