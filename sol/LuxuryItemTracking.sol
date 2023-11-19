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
