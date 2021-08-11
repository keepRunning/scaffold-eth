// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//import "../@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "hardhat/console.sol";

contract BBoard is ERC721, ERC721URIStorage, ERC721Enumerable, Pausable {
    using Counters for Counters.Counter;
    //id for each created bblock
    Counters.Counter private _bblockIds;

    address payable owner;
    //this is a fee in deployed network (matic) currency
    uint256 basefee = 500;

    constructor() ERC721("BulletinBlock", "BBLK") {
        owner = payable(msg.sender);
    }

    struct BBlock {
        // bytes11 FATname; // 8.3 DOS filename
        uint256 bblockId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    //map where bblockId returns the BBlock
    mapping(uint256 => BBlock) private idToBBlock;

    event BBlockCreated(
        uint256 indexed bblockId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function getBasefee() public view returns (uint256) {
        return basefee;
    }

    function createToken() public payable returns (uint256) {
        require(msg.value == getBasefee(), "Price must be equal to basefee");
        owner.transfer(getBasefee());
        _bblockIds.increment();
        uint256 newBBlockId = _bblockIds.current();
        _mint(msg.sender, newBBlockId);
        //save new bblock
        createNewBBlock(newBBlockId);
        //needed for subsequent sale of the block/nft
        return newBBlockId;
    }

    function addContentToBBlock(uint256 bblockId, string memory URI) public {
        require(
            msg.sender == ERC721.ownerOf(bblockId),
            "You don't own this NFT"
        );
        _setTokenURI(bblockId, URI);
    }

    //put the BBlock for sale
    function createBBlockSale(uint256 bblockId, uint256 price) public payable {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == getBasefee(), "Price must be equal to basefee");

        //pay the fee
        owner.transfer(msg.value);

        //transfer ownership
        transferFrom(msg.sender, address(this), bblockId);

        idToBBlock[bblockId].owner = payable(address(this));
        idToBBlock[bblockId].seller = payable(msg.sender);
        idToBBlock[bblockId].price = price;
        idToBBlock[bblockId].sold = false;
        _setTokenURI(bblockId, "");

        emit BBlockCreated(
            bblockId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    function buyBBlock(uint256 bblockId) public payable {
        uint256 price = idToBBlock[bblockId].price;
        uint256 tokenId = idToBBlock[bblockId].bblockId;

        require(msg.value == price);

        //pay the seller
        idToBBlock[bblockId].seller.transfer(msg.value);

        //transfer ownership
        transferFrom(address(this), msg.sender, tokenId);

        payable(owner).transfer(getBasefee());

        idToBBlock[bblockId].seller = payable(address(0));
        idToBBlock[bblockId].owner = payable(msg.sender);
        idToBBlock[bblockId].sold = true;
    }

    function createNewBBlock(uint256 bblockId) private {
        //create new bblock
        idToBBlock[bblockId] = BBlock(
            bblockId,
            payable(address(0)),
            payable(msg.sender),
            0,
            false
        );

        emit BBlockCreated(
            bblockId,
            payable(address(0)),
            payable(msg.sender),
            0,
            false
        );
    }

    function fetchBlocksByAddress(address adr)
        public
        view
        returns (BBlock[] memory)
    {}

    function getBBlockIdCounter() public view returns (uint256) {
        return _bblockIds.current();
    }

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

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
