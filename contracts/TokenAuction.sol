pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenAuction {
    ERC721 public nonFungibleContract;
    struct Auction {
        address payable seller;
        uint128 price;
    }

    // every auction associated to specific token
    /**{
        token1: auction1,
        token2: auction2
        ...
        tokenN: auctionN
    }
     */
    mapping (uint256 => Auction) public tokenIdToAuction;

    constructor(address _nftAddress) public {
        nonFungibleContract = ERC721(_nftAddress);
    }

    function createAuction( uint256 _tokenId, uint128 _price ) public {
        // auction takes temporary ownership of token
        nonFungibleContract.transferFrom(msg.sender, address(this), _tokenId);
        // assign new auction to temp memory variable
        Auction memory _auction = Auction({
            seller: msg.sender,
            price: uint128(_price)
        });
        // associate newly created auction to this token
        tokenIdToAuction[_tokenId] = _auction;
    }

    function bid( uint256 _tokenId ) public payable {
        Auction memory auction = tokenIdToAuction[_tokenId];
        // prevent returning empty struct by doing a non-null check
        require(auction.seller != address(0));
        // enough tokens sent in bid, match auction price
        require(msg.value >= auction.price);

        address payable seller = auction.seller;
        uint128 price = auction.price;

        delete tokenIdToAuction[_tokenId];
        // auction keeps the sent value (and extra profit) and sends seller to original price.
        // can be modified to transfer(msg.value)
        seller.transfer(price);
        // transfer the nft to bidder
        nonFungibleContract.transferFrom(address(this), msg.sender, _tokenId);
    }

    function cancel( uint256 _tokenId ) public {
        Auction memory auction = tokenIdToAuction[_tokenId];
        require(auction.seller == msg.sender);

        delete tokenIdToAuction[_tokenId];

        nonFungibleContract.transferFrom(address(this), msg.sender, _tokenId);
    }
}