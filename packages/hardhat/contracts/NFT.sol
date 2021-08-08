
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //address of the bulletin board contract, used for interaction with the NFT
    address contractAddress;

    constructor(address bboardAddress) ERC721("BulletinBlock", "BBLK") {
        contractAddress = bboardAddress;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newBBlockId = _tokenIds.current();
        _mint(msg.sender, newBBlockId);
        _setTokenURI(newBBlockId, tokenURI);
        //give bboard the right to transact
        setApprovalForAll(contractAddress, true);
        //needed for subsequent sale of the block/nft
        return newBBlockId;
    }
}
