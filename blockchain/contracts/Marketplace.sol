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

    struct Sale {
        address seller;
        address buyer;
        address nft;
        uint256 tokenId;
        uint256 price;
        uint256 timestamp;
    }

    struct Auction {
        address seller;
        address nft;
        uint256 tokenId;
        uint256 startPrice;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        bool ended;
    }

    // For Auction
    uint256 public auctionCount;
    mapping(uint256 => Auction) public auctions;

    // For Sold History
    Sale[] public sales;
    mapping(address => mapping(uint256 => bool)) public wasSold;

    event ItemListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nft,
        uint256 tokenId,
        uint256 price
    );

    event ItemSold(uint256 indexed listingId, address buyer);

    event ListingCancelled(uint256 indexed listingId);

    Listing[] public allListings;
    mapping(address => mapping(uint256 => uint256)) public listingIndex;

    function listItem(address nft, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be > 0");

        IERC721(nft).transferFrom(msg.sender, address(this), tokenId);

        allListings.push(Listing(msg.sender, price, nft, tokenId));
        uint256 index = allListings.length - 1;

        listingIndex[nft][tokenId] = index;

        emit ItemListed(index, msg.sender, nft, tokenId, price);
    }

    function buyItem(uint256 index) external payable {
        Listing memory item = allListings[index];

        require(msg.value == item.price, "Wrong ETH");

        (bool success, ) = payable(item.seller).call{value: msg.value}("");
        require(success, "ETH transfer failed");

        IERC721(item.nft).transferFrom(address(this), msg.sender, item.tokenId);

        // ✅ STORE SALE
        sales.push(
            Sale(
                item.seller,
                msg.sender,
                item.nft,
                item.tokenId,
                item.price,
                block.timestamp
            )
        );
        //For Sold badges
        wasSold[item.nft][item.tokenId] = true;

        uint256 last = allListings.length - 1;

        if (index != last) {
            Listing memory lastItem = allListings[last];
            allListings[index] = lastItem;
            listingIndex[lastItem.nft][lastItem.tokenId] = index;
        }

        allListings.pop();
        delete listingIndex[item.nft][item.tokenId];

        emit ItemSold(index, msg.sender);
    }

    function cancelListing(uint256 index) external {
        Listing memory item = allListings[index];
        require(item.seller == msg.sender, "Not seller");

        IERC721(item.nft).transferFrom(
            address(this),
            item.seller,
            item.tokenId
        );

        uint256 last = allListings.length - 1;

        if (index != last) {
            Listing memory lastItem = allListings[last];
            allListings[index] = lastItem;
            listingIndex[lastItem.nft][lastItem.tokenId] = index;
        }

        allListings.pop();
        delete listingIndex[item.nft][item.tokenId];

        emit ListingCancelled(index);
    }

    function updatePrice(uint256 index, uint256 newPrice) external {
        require(newPrice > 0, "Price must be > 0");
        require(index < allListings.length, "Invalid index");

        Listing storage item = allListings[index];
        require(item.seller == msg.sender, "Not seller");

        item.price = newPrice;
    }

    function getAllListings() external view returns (Listing[] memory) {
        return allListings;
    }

    function getSales() external view returns (Sale[] memory) {
        return sales;
    }

    function isSold(address nft, uint256 tokenId) external view returns (bool) {
        return wasSold[nft][tokenId];
    }

    // Auction Create
    function createAuction(
        address nft,
        uint256 tokenId,
        uint256 startPrice,
        uint256 duration
    ) external {
        IERC721(nft).transferFrom(msg.sender, address(this), tokenId);

        auctionCount++;

        auctions[auctionCount] = Auction({
            seller: msg.sender,
            nft: nft,
            tokenId: tokenId,
            startPrice: startPrice,
            highestBid: 0,
            highestBidder: address(0),
            endTime: block.timestamp + duration,
            ended: false
        });
    }

    function bid(uint256 auctionId) external payable {
        Auction storage a = auctions[auctionId];

        require(block.timestamp < a.endTime, "Auction ended"); //Timeout
        require(!a.ended, "Auction closed");

        uint256 minBid = a.highestBid == 0
            ? a.startPrice
            : a.highestBid + (a.highestBid / 10); //10% increment

        require(msg.value >= minBid, "Bid too low");

        //Refund previous bidder
        if (a.highestBidder != address(0)) {
            payable(a.highestBidder).transfer(a.highestBid);
        }

        a.highestBid = msg.value;
        a.highestBidder = msg.sender;
    }

    function endAuction(uint256 auctionId) external {
        Auction storage a = auctions[auctionId];

        require(block.timestamp >= a.endTime, "Auction still active");
        require(!a.ended, "Already ended");

        a.ended = true;

        if (a.highestBidder != address(0)) {
            IERC721(a.nft).transferFrom(
                address(this),
                a.highestBidder,
                a.tokenId
            );
            payable(a.seller).transfer(a.highestBid);
        } else {
            // No bids → return NFT
            IERC721(a.nft).transferFrom(address(this), a.seller, a.tokenId);
        }
    }

    function getAuction(uint256 auctionId) external view returns (Auction memory) {
        return auctions[auctionId];
    }

}
