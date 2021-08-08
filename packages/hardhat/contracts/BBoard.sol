// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//import "../@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
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
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == getBasefee(), "Price must be equal to basefee");

        _bblockIds.increment();
        uint256 bblockId = _bblockIds.current();

        //pay the fee
        owner.transfer(msg.value);

        idToBBlock[bblockId] = BBlock(
            bblockId,
            payable(msg.sender),
            payable(address(0)),
            price,
            nftContract,
            tokenId,
            false
        );

        //transfer ownership
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit BBlockCreated(
            bblockId,
            msg.sender,
            address(0),
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

        idToBBlock[bblockId].owner = payable(msg.sender);
        idToBBlock[bblockId].sold = true;
        payable(owner).transfer(getBasefee());
    }

    // function sellBBlock(address nftContract, uint256 bblockId)
    //     public
    //     payable
    //     nonReentrant
    // {
    //     uint256 price = idToBBlock[bblockId].price;
    //     uint256 tokenId = idToBBlock[bblockId].tokenId;
    //     require(msg.value == price);

    //     //pay the seller
    //     idToBBlock[bblockId].seller.transfer(msg.value);
    //     //transfer ownership
    //     IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    //     idToBBlock[bblockId].owner = payable(msg.sender);
    //     idToBBlock[bblockId].sold = true;
    //     _itemsSold.increment();
    //     payable(owner).transfer(getBasefee());
    // }

    function addContentToBBlock(uint256 tokenId, string memory tokenURI) public {
       
       //require(ERC721.ownerOf(tokenId) == msg.sender, "You don't own this NFT");
       payable(owner).transfer(getBasefee());
       //_setTokenURI(tokenId, tokenURI);

    }

    function removeContentfromBBlock(uint256 tokenId) public {
        //require(ERC721.ownerOf(tokenId) == msg.sender, "You don't own this BBlock");
        payable(owner).transfer(getBasefee());
        //_setTokenURI(tokenId, "0");
        
    }
}
