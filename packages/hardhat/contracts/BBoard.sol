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
    uint256 basefee = 1;

    constructor() ERC721("BulletinBlock", "BBLK") {
        owner = payable(msg.sender);
    }

    struct BBlock {
        uint256 bblockId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    //map where bblockId returns the BBlock
    mapping(uint256 => BBlock) private idToBBlock;

    event BBlockCreated(uint256 indexed bblockId, address owner);
    event SaleCreated(uint256 indexed bblockId, address seller, uint256 price);

    function getBasefee() public view returns (uint256) {
        return basefee;
    }

    function setBasefee(uint256 x) public {
        require(msg.sender == owner);
        basefee = x;
    }

    function createToken() public payable returns (uint256) {
        require(msg.value == getBasefee(), "Price must be equal to basefee");
        owner.transfer(getBasefee());
        _bblockIds.increment();
        uint256 newBBlockId = _bblockIds.current();
        _mint(msg.sender, newBBlockId);
        //save new bblock
        addNewBBlock(newBBlockId);
        //needed for subsequent sale of the block/nft
        return newBBlockId;
    }

    function addNewBBlock(uint256 bblockId) private {
        idToBBlock[bblockId] = BBlock(
            bblockId,
            payable(address(0)),
            payable(msg.sender),
            0,
            false
        );

        emit BBlockCreated(bblockId, payable(msg.sender));
    }

    function addContentToBBlock(uint256 bblockId, string memory URI) public {
        require(
            msg.sender == ERC721.ownerOf(bblockId),
            "You don't own this BBlock"
        );
        _setTokenURI(bblockId, URI);
    }

    function sellBBlock(uint256 bblockId, uint256 price) public payable {
        require(
            idToBBlock[bblockId].seller == payable(address(0)),
            "BBlock already for sale"
        );
        require(
            msg.sender == ERC721.ownerOf(bblockId),
            "You don't own this BBlock"
        );

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

        emit SaleCreated(bblockId, msg.sender, price);
    }

    //needs fixin
    function cancelSell(uint256 bblockId) public {
        // require(1 == 2, "nope");

        require(
            payable(msg.sender) == idToBBlock[bblockId].seller,
            "You are not the seller of this BBlock"
        );

        //transfer ownership
        transferFrom(address(this), msg.sender, bblockId);

        idToBBlock[bblockId].owner = payable(msg.sender);
        idToBBlock[bblockId].seller = payable(address(0));
        idToBBlock[bblockId].price = 0;
        idToBBlock[bblockId].sold = false;
    }

    //needs fixin
    function buyBBlock(uint256 bblockId) public payable {
        // require(1 == 2, "nope");
        require(
            idToBBlock[bblockId].seller != payable(address(0)),
            "BBlock not for sale"
        );
        uint256 price = idToBBlock[bblockId].price;

        require(msg.value == price, "Value must be equal to price");

        //pay the seller
        idToBBlock[bblockId].seller.transfer(msg.value);

        //transfer ownership
        transferFrom(address(this), msg.sender, bblockId);

        idToBBlock[bblockId].seller = payable(address(0));
        idToBBlock[bblockId].owner = payable(msg.sender);
        idToBBlock[bblockId].sold = true;

        payable(owner).transfer(getBasefee());
    }

    function getPrice(uint256 bblockId) public view returns (uint256) {
        return idToBBlock[bblockId].price;
    }

    function fetchBBlocksByAddress(address adr)
        public
        view
        returns (BBlock[] memory)
    {
        uint256 totalItemCount = _bblockIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToBBlock[i + 1].owner == adr) {
                itemCount += 1;
            }
        }

        BBlock[] memory items = new BBlock[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToBBlock[i + 1].owner == adr) {
                uint256 currentId = i + 1;
                BBlock storage currentItem = idToBBlock[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function getBBlockIdCounter() public view returns (uint256) {
        return _bblockIds.current();
    }

    // function fetchMyNFTs() public view returns (BBlock[] memory) {
    //     uint256 totalItemCount = _bblockIds.current();
    //     uint256 itemCount = 0;
    //     uint256 currentIndex = 0;

    //     for (uint256 i = 0; i < totalItemCount; i++) {
    //         if (idToBBlock[i + 1].owner == payable(msg.sender)) {
    //             itemCount += 1;
    //         }
    //     }

    //     BBlock[] memory items = new BBlock[](itemCount);
    //     for (uint256 i = 0; i < totalItemCount; i++) {
    //         if (idToBBlock[i + 1].owner == payable(msg.sender)) {
    //             uint256 currentId = i + 1;
    //             BBlock storage currentItem = idToBBlock[currentId];
    //             items[currentIndex] = currentItem;
    //             currentIndex += 1;
    //         }
    //     }
    //     return items;
    // }

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
