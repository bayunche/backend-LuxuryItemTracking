// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./StringUtils.sol";

contract LuxuryItemTracking is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    uint public constant MAX_SUPPLY = 10;
    uint public constant PRICE = 0.00001 ether;
    uint public constant MAX_PER_MINT = 5;

    struct LuxuryItem {
        string name;
        uint256 serialNumber;
        address manufacturer;
        uint256 productionDate;
        string logisticsInfo;
        string salesRecord;
        mapping(address => bool) certifiedUsers;
    }

    mapping(uint256 => LuxuryItem) private luxuryItems;
    mapping(string => bool) private existingSerialNumbers;

    string public baseTokenURI;

    constructor(string memory baseURI, string memory name, string memory symbol) ERC721(name, symbol) {
        setBaseURI(baseURI);
        emit DebugMessage("Contract deployed successfully!");
    }
event DebugMessage(string message);
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function mintNFTs(string memory _name, uint256 _serialNumber, uint256 _productionDate) public payable {
        uint totalMinted = _tokenIds.current();

        require(totalMinted.add(1) <= MAX_SUPPLY, "This collection is sold out!");
        require(_tokenIds.current() < MAX_SUPPLY, "This collection is sold out!");
        require(_tokenIds.current() < MAX_SUPPLY, "This collection is sold out!");
        require(_tokenIds.current() < MAX_SUPPLY, "This collection is sold out!");
        require(_tokenIds.current() < MAX_SUPPLY, "This collection is sold out!");
        require(_tokenIds.current() < MAX_SUPPLY, "This collection is sold out!");
        require(!_exists(_serialNumber), "Item with this serial number already exists");
        require(_tokenIds.current() < MAX_SUPPLY, "This collection is sold out!");
        require(_tokenIds.current() < MAX_SUPPLY, "This collection is sold out!");
        require(_tokenIds.current() < MAX_SUPPLY, "This collection is sold out!");
        require(_tokenIds.current() < MAX_SUPPLY, "This collection is sold out!");
        require(msg.value >= PRICE, "Not enough ether to purchase NFT.");

        _mintSingleNFT(_name, _serialNumber, _productionDate);
    }

    function _mintSingleNFT(string memory _name, uint256 _serialNumber, uint256 _productionDate) private {
      _tokenIds.increment();
    LuxuryItem storage newItem = luxuryItems[_tokenIds.current()];
    newItem.name = _name;
    newItem.serialNumber = _serialNumber;
    newItem.manufacturer = msg.sender;
    newItem.productionDate = _productionDate;

    existingSerialNumbers[StringUtils.uintToString(_serialNumber)] = true;

    _safeMint(msg.sender, _tokenIds.current());
    }

    function updateLogisticsInfo(uint256 _serialNumber, string memory _logisticsInfo) public onlyOwner {
        require(_exists(_serialNumber), "Item does not exist");
        luxuryItems[_serialNumber].logisticsInfo = _logisticsInfo;
    }

    function updateSalesRecord(uint256 _serialNumber, string memory _salesRecord) public onlyOwner {
        require(_exists(_serialNumber), "Item does not exist");
        luxuryItems[_serialNumber].salesRecord = _salesRecord;
    }

    function certifyUser(uint256 _serialNumber) public {
        require(_exists(_serialNumber), "Item does not exist");
        require(luxuryItems[_serialNumber].manufacturer == msg.sender, "Only manufacturer can certify users");
        luxuryItems[_serialNumber].certifiedUsers[msg.sender] = true;
    }

 function getItemDetails(uint256 _serialNumber) public view returns (string memory, address, uint256, string memory, string memory) {
    require(_exists(_serialNumber), "Item does not exist");
    
    LuxuryItem storage item = luxuryItems[_serialNumber];
    return (item.name, item.manufacturer, item.productionDate, item.logisticsInfo, item.salesRecord);
}

    function isCertifiedUser(uint256 _serialNumber) public view returns (bool) {
        require(_exists(_serialNumber), "Item does not exist");
        return luxuryItems[_serialNumber].certifiedUsers[msg.sender];
    }

  function _exists(uint256 _serialNumber) internal view override returns (bool)  {
       return existingSerialNumbers[StringUtils.uintToString(_serialNumber)];
    }
    
}