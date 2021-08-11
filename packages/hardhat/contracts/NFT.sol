// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";
import "./BBoard.sol";

contract NFT is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //address of the bulletin board contract, used for interaction with the NFT
    address bboardAddress;
    uint basefee = 1000;
    address payable owner;
    BBoard instanceBBoard;

    constructor(address _bboardAddress) ERC721("BulletinBlock", "BBLK") {
        bboardAddress = _bboardAddress;
        instanceBBoard = BBoard(bboardAddress);
        owner = payable(msg.sender);
    }

    function createToken() public payable returns (uint256) {
        require(msg.value == getBasefee(),"Price must be equal to basefee");
        owner.transfer(getBasefee());
        _tokenIds.increment();
        uint256 newBBlockId = _tokenIds.current();
        _mint(bboardAddress, newBBlockId);
        //give bboard the right to transact
        setApprovalForAll(bboardAddress, true);
        //pay basefee, save new bblock
        buyNewBBlock_1(address(this), newBBlockId);
        //needed for subsequent sale of the block/nft
        return newBBlockId;
    }

    //calls bboard's buyNewBBlock function
    function buyNewBBlock_1(address nftContract, uint256 tokenId) internal {
        instanceBBoard.buyNewBBlock(nftContract, tokenId);
    }

    function getTokenIdCounter() public view returns (uint) {
        return _tokenIds.current();
    }

    function addContentToBBlock(uint256 tokenId, string memory tokenURI)
        public
    {
        require(ownerOf(tokenId) == msg.sender, "You don't own this BBlock");
        owner.transfer(getBasefee());
        _setTokenURI(tokenId, tokenURI);
    }

    function removeContentfromBBlock(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You don't own this BBlock");
        owner.transfer(getBasefee());
        _setTokenURI(tokenId, "0");
    }

    function getBasefee() public view returns (uint256) {
        return basefee;
    }
}
