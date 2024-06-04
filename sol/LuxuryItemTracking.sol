
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
