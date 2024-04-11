// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract LuxuryItemTracking is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

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
        bool isCertified;
        uint256 valuation;
        string certification;
    }

    mapping(uint256 => LuxuryItem) private luxuryItems;
    mapping(uint256 => bool) private serialNumberExists;

    string public baseURI;

    event LuxuryItemCertificationUpdated(uint256 indexed serialNumber, bool isCertified);
    event LuxuryItemValuationUpdated(uint256 indexed serialNumber, uint256 valuation);
    event CertificationSet(uint256 indexed serialNumber, string certification);
    event ValuationSet(uint256 indexed serialNumber, uint256 valuation);

    constructor(string memory _baseURI, string memory name, string memory symbol) ERC721(name, symbol) {
        baseURI = _baseURI;
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function mintNFT(string memory name, uint256 serialNumber, uint256 productionDate) public payable {
        require(_tokenIds.current() < MAX_SUPPLY, "Collection is sold out!");
        require(msg.value >= PRICE, "Not enough ether sent.");
        require(!serialNumberExists[serialNumber], "Serial number already used");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        LuxuryItem storage item = luxuryItems[serialNumber];
        item.name = name;
        item.manufacturer = msg.sender;
        item.productionDate = productionDate;
        item.logisticsInfo = "";
        item.salesRecord = "";
        item.isCertified = false;
        item.valuation = 0;
        item.certification = "";

        serialNumberExists[serialNumber] = true;

        _safeMint(msg.sender, newTokenId);
    }

    function _exists(uint256 serialNumber) internal view override returns (bool) {
        return serialNumberExists[serialNumber];
    }

    function updateLogisticsInfo(uint256 serialNumber, string memory logisticsInfo) public onlyOwner {
        require(_exists(serialNumber), "Item does not exist");
        luxuryItems[serialNumber].logisticsInfo = logisticsInfo;
    }

    function updateSalesRecord(uint256 serialNumber, string memory salesRecord) public onlyOwner {
        require(_exists(serialNumber), "Item does not exist");
        luxuryItems[serialNumber].salesRecord = salesRecord;
    }

    function certifyUser(uint256 serialNumber, bool isCertified) public {
        require(_exists(serialNumber), "Item does not exist");
        require(luxuryItems[serialNumber].manufacturer == msg.sender, "Only manufacturer can certify users");
        luxuryItems[serialNumber].isCertified = isCertified;
        emit LuxuryItemCertificationUpdated(serialNumber, isCertified);
    }

    function getItemDetails(uint256 serialNumber) public view returns (
        string memory name,
        address manufacturer,
        uint256 productionDate,
        string memory logisticsInfo,
        string memory salesRecord
    ) {
        require(_exists(serialNumber), "Item does not exist");
        LuxuryItem storage item = luxuryItems[serialNumber];
        return (
            item.name,
            item.manufacturer,
            item.productionDate,
            item.logisticsInfo,
            item.salesRecord
        );
    }

    function setLuxuryItemCertification(uint256 serialNumber, string memory certification) public onlyOwner {
        require(_exists(serialNumber), "Item does not exist");
        luxuryItems[serialNumber].certification = certification;
        emit CertificationSet(serialNumber, certification);
    }

    function isCertifiedUser(uint256 serialNumber) public view returns (bool) {
        require(_exists(serialNumber), "Item does not exist");
        return luxuryItems[serialNumber].isCertified;
    }
}
