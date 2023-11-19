// SPDX-License-Identifier: Academic Free License v2.1

// Updated LuxuryItemTracking.sol
pragma solidity ^0.8.0;

contract LuxuryItemTracking {
    enum ItemStatus { Manufactured, Shipped, Delivered, Sold }

    struct LuxuryItem {
        string name;
        uint256 serialNumber;
        address manufacturer;
        uint256 productionDate;
        ItemStatus status;
        string logisticsInfo;
        string salesRecord;
    }

    mapping(uint256 => LuxuryItem) public luxuryItems;
    mapping(address => mapping(uint256 => bool)) public userCertifications;
    address public admin;

    event ItemManufactured(
        string name,
        uint256 serialNumber,
        address manufacturer,
        uint256 productionDate
    );

    event ItemShipped(uint256 serialNumber, string logisticsInfo);

    event ItemDelivered(uint256 serialNumber);

    event ItemSold(uint256 serialNumber, string salesRecord);

    event UserCertified(address user, uint256 serialNumber);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyManufacturer(uint256 _serialNumber) {
        require(msg.sender == luxuryItems[_serialNumber].manufacturer, "Only manufacturer can call this function");
        _;
    }

    modifier itemNotManufactured(uint256 _serialNumber) {
        require(luxuryItems[_serialNumber].serialNumber == 0, "Item already exists");
        _;
    }

    modifier itemManufactured(uint256 _serialNumber) {
        require(luxuryItems[_serialNumber].serialNumber != 0, "Item does not exist");
        _;
    }

    modifier itemNotSold(uint256 _serialNumber) {
        require(luxuryItems[_serialNumber].status != ItemStatus.Sold, "Item already sold");
        _;
    }

    function manufactureItem(
        string memory _name,
        uint256 _serialNumber,
        uint256 _productionDate
    ) public onlyAdmin itemNotManufactured(_serialNumber) {
        luxuryItems[_serialNumber] = LuxuryItem({
            name: _name,
            serialNumber: _serialNumber,
            manufacturer: msg.sender,
            productionDate: _productionDate,
            status: ItemStatus.Manufactured,
            logisticsInfo: "",
            salesRecord: ""
        });

        emit ItemManufactured(_name, _serialNumber, msg.sender, _productionDate);
    }

    function shipItem(uint256 _serialNumber, string memory _logisticsInfo) public onlyManufacturer(_serialNumber) itemManufactured(_serialNumber) itemNotSold(_serialNumber) {
        luxuryItems[_serialNumber].status = ItemStatus.Shipped;
        luxuryItems[_serialNumber].logisticsInfo = _logisticsInfo;

        emit ItemShipped(_serialNumber, _logisticsInfo);
    }

    function deliverItem(uint256 _serialNumber) public onlyManufacturer(_serialNumber) itemManufactured(_serialNumber) itemNotSold(_serialNumber) {
        luxuryItems[_serialNumber].status = ItemStatus.Delivered;

        emit ItemDelivered(_serialNumber);
    }

    function sellItem(uint256 _serialNumber, string memory _salesRecord) public onlyManufacturer(_serialNumber) itemManufactured(_serialNumber) itemNotSold(_serialNumber) {
        luxuryItems[_serialNumber].status = ItemStatus.Sold;
        luxuryItems[_serialNumber].salesRecord = _salesRecord;

        emit ItemSold(_serialNumber, _salesRecord);
    }

    function certifyUser(uint256 _serialNumber) public itemManufactured(_serialNumber) {
        userCertifications[msg.sender][_serialNumber] = true;

        emit UserCertified(msg.sender, _serialNumber);
    }

    function getItemDetails(uint256 _serialNumber) public view returns (string memory, address, uint256, ItemStatus, string memory, string memory) {
        LuxuryItem memory item = luxuryItems[_serialNumber];
        require(item.serialNumber != 0, "Item does not exist");
        return (item.name, item.manufacturer, item.productionDate, item.status, item.logisticsInfo, item.salesRecord);
    }

    function isUserCertified(address _user, uint256 _serialNumber) public view returns (bool) {
        return userCertifications[_user][_serialNumber];
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LuxuryGoodsNFT is ERC721, Ownable {
    uint256 private _tokenIds;

    // 奢侈品数据结构
    struct LuxuryItem {
        string brand;
        string model;
        string manufactureDate;
        string serialNumber;
    }

    // 销售记录数据结构
    struct SalesRecord {
        uint256 saleDate;
        uint256 price;
        string buyer;
    }

    // 物流信息数据结构
    struct LogisticsInfo {
        string shippingDate;
        string carrier;
        string trackingNumber;
        string status;
    }

    // 奢侈品详情结构，包括估值
    struct LuxuryItemDetails {
        LuxuryItem item;
        SalesRecord sales;
        LogisticsInfo logistics;
        uint256 valuation;
    }

    // tokenId到奢侈品数据的映射
    mapping(uint256 => LuxuryItem) public luxuryItems;

    // tokenId到销售记录的映射
    mapping(uint256 => SalesRecord) public salesRecords;

    // tokenId到物流信息的映射
    mapping(uint256 => LogisticsInfo) public logisticsInfoMap;

    // tokenId到奢侈品估值的映射
    mapping(uint256 => uint256) public valuations;

    constructor() ERC721("LuxuryGoodsNFT", "LGNFT") {}

    // 注册奢侈品并创建NFT
    function registerLuxuryItem(string memory brand, string memory model, string memory manufactureDate, string memory serialNumber) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _mint(msg.sender, newItemId);
        luxuryItems[newItemId] = LuxuryItem(brand, model, manufactureDate, serialNumber);

        return newItemId;
    }

    // 设置奢侈品的销售记录
    function setSalesRecord(uint256 tokenId, uint256 saleDate, uint256 price, string memory buyer) public onlyOwner {
        require(_exists(tokenId), "LuxuryGoodsNFT: attempt to set sales record for nonexistent token");
        salesRecords[tokenId] = SalesRecord(saleDate, price, buyer);
    }

    // 设置奢侈品的物流信息
    function setLogisticsInfo(uint256 tokenId, string memory shippingDate, string memory carrier, string memory trackingNumber, string memory status) public onlyOwner {
        require(_exists(tokenId), "LuxuryGoodsNFT: attempt to set logistics info for nonexistent token");
        logisticsInfoMap[tokenId] = LogisticsInfo(shippingDate, carrier, trackingNumber, status);
    }

    // 设置或更新奢侈品的估值
    function setValuation(uint256 tokenId, uint256 valuation) public onlyOwner {
        require(_exists(tokenId), "LuxuryGoodsNFT: attempt to set valuation for nonexistent token");
        valuations[tokenId] = valuation;
    }

    // 获取奢侈品的详细信息，包括估值
    function getLuxuryItemDetails(uint256 tokenId) public view returns (LuxuryItemDetails memory) {
        require(_exists(tokenId), "LuxuryGoodsNFT: query for nonexistent token");
        return LuxuryItemDetails(
            luxuryItems[tokenId],
            salesRecords[tokenId],
            logisticsInfoMap[tokenId],
            valuations[tokenId]
        );
    }
}
