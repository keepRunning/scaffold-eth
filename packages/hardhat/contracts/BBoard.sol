// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BBoard is ReentrancyGuard {
    using Counters for Counters.Counter;
    //id for each created bblock
    Counters.Counter private _bblockIds;

    address payable owner;
    //this is a fee in deployed network (matic) currency
    uint256 basefee = 0.025 ether;

    constructor(){
        owner = payable(msg.sender);
    }

      struct BBlock {
    // bytes11 FATname; // 8.3 DOS filename
    address owner;
    uint256 index;
    uint256 price;
    address nft;
    uint256 tokenId;
    bool sold;
  }

    //map where bblockId returns the BBlock
    mapping(uint256 => BBlock) private idToBBlock;

  function getBasefee() public view returns(uint256){
      return basefee;
  }

    function createBBlock(
address nftContract,
uint256 index,
  uint256 tokenId,
  uint256 price 
  )public payable nonReentrant{
      require(price>0,"Price must be at least 1 wei");
      require(msg.value == getBasefee(),
      "Price must be equal to basefee");
    _bblockIds.increment();
    uint256 bblockId = _bblockIds.current();

    idToBblock[bblockId] = BBlock(
        payable(msg.sender),
        index,
        price,
        "",
        nftContract,
        tokenId,
        false
    );

    //transfer ownership        
    IERC721(nftContract).transferFrom(msg.sender,address(this) ,tokenId);

  }

//   function buyBBlock(
// address nftContract,
// uint256 index,
//   uint256 tokenId,
//   uint256 price 
//   )public payable nonReentrant{
//       require(price>0,"Price must be at least 1 wei");
//       require(msg.value == getBasefee(),
//       "Price must be equal to basefee");
//     _bblockIds.increment();
//     uint256 bblockId = _bblockIds.current();

//     idToBblock[bblockId] = BBlock(
//         payable(msg.sender),
//         index,
//         price,
//         "",
//         nftContract,
//         tokenId,
//         true
//     );

//     //transfer ownership        
//     IERC721(nftContract).transferFrom(address(this), msg.sender ,tokenId);

//   }

  function addContentToBBlock(){

  }

  function removeContentfromBBlock(){

  }

  function sellBBlock(){

  }

}