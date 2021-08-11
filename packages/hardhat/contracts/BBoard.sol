// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//import "../@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

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
        uint256 bblockId;
        address payable seller;
        address payable owner;
        uint256 price;
        address nft;
        uint256 tokenId;
        bool sold;
    }

    //map where bblockId returns the BBlock
    mapping(uint256 => BBlock) private idToBBlock;

    event BBlockCreated(
        uint256 indexed bblockId,
        address seller,
        address owner,
        uint256 price,
        address indexed nft,
        uint256 indexed tokenId,
        bool sold
    );

    function getBasefee() public view returns (uint256) {
        return basefee;
    }
    

    //put the BBlock for sale
    function createBBlockSale(
        address nftContract,
        uint256 bblockId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == getBasefee(), "Price must be equal to basefee");

        //pay the fee
        owner.transfer(msg.value);

        uint256 tokenId = idToBBlock[bblockId].tokenId;

        //transfer ownership
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        idToBBlock[bblockId].owner = payable(address(this));
        idToBBlock[bblockId].seller = payable(msg.sender);
        idToBBlock[bblockId].price = price;
        idToBBlock[bblockId].sold = false;

        emit BBlockCreated(
            bblockId,
            msg.sender,
            address(this),
            price,
            nftContract,
            tokenId,
            false
        );
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

        payable(owner).transfer(getBasefee());

        idToBBlock[bblockId].seller = payable(address(0));
        idToBBlock[bblockId].owner = payable(msg.sender);
        idToBBlock[bblockId].sold = true;
    }

    function buyNewBBlock(address nftContract, uint256 tokenId)
        public
        nonReentrant
    {
        // require(msg.value == getBasefee(), "Price must be equal to basefee");

        //pay fee
        // owner.transfer(getBasefee());

        //transfer ownership
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

                // require(0==1,"haha nope");

        _bblockIds.increment();
        uint256 bblockId = _bblockIds.current();

        //create new bblock
        idToBBlock[bblockId] = BBlock(
            bblockId,
            payable(address(0)),
            payable(msg.sender),
            0,
            nftContract,
            tokenId,
            false
        );

          emit BBlockCreated(
            bblockId,
            payable(address(0)),
            payable(msg.sender),
            0,
            nftContract,
            tokenId,
            false
        );
    }

    function fetchBlocksByAddress(address adr)
        public
        view
        returns (BBlock[] memory)
    {}

    function fetchMyNFTs() public view returns (BBlock[] memory) {
        uint256 totalItemCount = _bblockIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToBBlock[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        BBlock[] memory items = new BBlock[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToBBlock[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                BBlock storage currentItem = idToBBlock[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
