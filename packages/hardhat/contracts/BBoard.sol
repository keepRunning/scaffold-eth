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

    constructor() {
        owner = payable(msg.sender);
    }

    struct BBlock {
        // bytes11 FATname; // 8.3 DOS filename
        address payable seller;
        address payable owner;
        uint256 price;
        address nft;
        uint256 tokenId;
        bool sold;
    }

    //map where bblockId returns the BBlock
    mapping(uint256 => BBlock) private idToBBlock;

    function getBasefee() public view returns (uint256) {
        return basefee;
    }

    function createBBlock(address nftContract, uint256 tokenId)
        public
        payable
        nonReentrant
    {
        require(msg.value == getBasefee(), "Price must be equal to basefee");
        _bblockIds.increment();
        uint256 bblockId = _bblockIds.current();

        //pay the fee
        owner.transfer(msg.value);

        idToBBlock[bblockId] = BBlock(
            payable(address(0)),
            payable(msg.sender),
            0,
            nftContract,
            tokenId,
            false
        );

        //transfer ownership
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    }

    function buyBBlock(address nftContract, uint256 bblockId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToBBlock[bblockId].price;
        uint256 tokenId = idToBBlock[bblockId].tokenId;
        require(msg.value == price);

        //pay the seller
        idToBBlock[bblockId].seller.transfer(msg.value);

        //transfer ownership
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idToBBlock[bblockId].owner = payable(msg.sender);
        idToBBlock[bblockId].sold = true;
        payable(owner).transfer(getBasefee());
    }
    
    function sellBBlock(address nftContract, uint256 bblockId) public payable nonReentrant {
      
      uint256 price = idToBBlock[bblockId].price;
      uint256 tokenId = idToBBlock[bblockId].tokenId;
      require(msg.value == price);

      //pay the seller
      idToBBlock[bblockId].seller.transfer(msg.value);
      //transfer ownership
      IERC721(nftContract).transferFrom(address(this), msg.sender ,tokenId);
      idToBBlock[bblockId].owner = payable(msg.sender);
      idToBBlock[bblockId].sold = true;
      _itemsSold.increment();
      payable(owner).transfer(getBasefee());
  }

    function addContentToBBlock() public {}

    function removeContentfromBBlock() public {}
}
