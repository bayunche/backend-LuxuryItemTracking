// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./StringUtils.sol";

contract LuxuryItemTracking is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    event LuxuryItemCertificationUpdated(
        uint256 indexed serialNumber,
        bool isCertified
    );
    event LuxuryItemValuationUpdated(
        uint256 indexed serialNumber,
        uint256 valuation
    );
    Counters.Counter private _tokenIds;
    uint public constant MAX_SUPPLY = 10;
    uint public constant PRICE = 0.00001 ether;

    struct LuxuryItem {
        string name;
        uint256 serialNumber;
        address manufacturer;
        uint256 productionDate;
        string logisticsInfo;
        string salesRecord;
        bool isCertified; // 简化认证用户的存储
        uint256 valuation;
        string certification;
        mapping(address => bool) certifiedUsers;
    }

    mapping(uint256 => LuxuryItem) private luxuryItems;

    string public baseTokenURI;

    event ValuationSet(uint256 indexed serialNumber, uint256 valuation);
    event CertificationSet(uint256 indexed serialNumber, string certification);

    constructor(
        string memory baseURI,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        setBaseURI(baseURI);
    }

    function setLuxuryItemValuation(
        uint256 _serialNumber,
        uint256 _valuation
    ) public onlyOwner {
        require(_exists(_serialNumber), "Item does not exist");
        luxuryItems[_serialNumber].valuation = _valuation;
        emit ValuationSet(_serialNumber, _valuation);
        emit LuxuryItemValuationUpdated(_serialNumber, _valuation);
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function mintNFT(
        string memory _name,
        uint256 _serialNumber,
        uint256 _productionDate
    ) public payable {
        require(
            _tokenIds.current() < MAX_SUPPLY,
            "This collection is sold out!"
        );
        require(msg.value >= PRICE, "Not enough ether to purchase NFT.");
        require(
            !_exists(_serialNumber),
            "Item with this serial number already exists"
        );

        _mintSingleNFT(_name, _serialNumber, _productionDate);
    }

    function _mintSingleNFT(
        string memory _name,
        uint256 _serialNumber,
        uint256 _productionDate
    ) private {
        _tokenIds.increment();
        LuxuryItem storage newItem = luxuryItems[_serialNumber];
        newItem.name = _name;
        newItem.serialNumber = _serialNumber;
        newItem.manufacturer = msg.sender;
        newItem.productionDate = _productionDate;
        newItem.isCertified = false; // 默认未认证

        _safeMint(msg.sender, _serialNumber);
    }

    function _exists(
        uint256 _serialNumber
    ) internal view override returns (bool) {
        return luxuryItems[_serialNumber].serialNumber == _serialNumber;
    }

    function updateLogisticsInfo(
        uint256 _serialNumber,
        string memory _logisticsInfo
    ) public onlyOwner {
        require(_exists(_serialNumber), "Item does not exist");
        luxuryItems[_serialNumber].logisticsInfo = _logisticsInfo;
    }

    function updateSalesRecord(
        uint256 _serialNumber,
        string memory _salesRecord
    ) public onlyOwner {
        require(_exists(_serialNumber), "Item does not exist");
        luxuryItems[_serialNumber].salesRecord = _salesRecord;
    }

    function certifyUser(uint256 _serialNumber, bool _isCertified) public {
        require(_exists(_serialNumber), "Item does not exist");
        require(
            luxuryItems[_serialNumber].manufacturer == msg.sender,
            "Only manufacturer can certify users"
        );
        luxuryItems[_serialNumber].certifiedUsers[msg.sender] = true;
        emit LuxuryItemCertificationUpdated(_serialNumber, _isCertified);
    }

  function getItemDetails(uint256 _serialNumber)
    public
    view
    returns (
        string memory,
        address,
        uint256,
        string memory,
        string memory
    )
{
    require(_exists(_serialNumber), "Item does not exist");
    LuxuryItem storage item = luxuryItems[_serialNumber];
    return (
        item.name,
        item.manufacturer,
        item.productionDate,
        item.logisticsInfo,
        item.salesRecord
    );
   

 
}


    function setLuxuryItemCertification(
        uint256 _serialNumber,
        string memory _certification
    ) public onlyOwner {
        require(_exists(_serialNumber), "Item does not exist");
        luxuryItems[_serialNumber].certification = _certification;
        emit CertificationSet(_serialNumber, _certification);
    }

    function isCertifiedUser(uint256 _serialNumber) public view returns (bool) {
        require(_exists(_serialNumber), "Item does not exist");
        return luxuryItems[_serialNumber].certifiedUsers[msg.sender];
    }
    function itemExists(uint256 _serialNumber) public view returns (bool) {
        return _exists(_serialNumber);
    }
}
