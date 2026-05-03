// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ProductAuthentication
 * @dev Smart contract for fake product identification
 * Deploy with Hardhat: npx hardhat run scripts/deploy.js --network sepolia
 */
contract ProductAuthentication {
    struct GeoLocation {
        int256 latitude;   // multiplied by 1e6 for precision
        int256 longitude;  // multiplied by 1e6 for precision
        uint256 timestamp;
    }

    struct ProductEvent {
        address owner;
        string role;
        string action;
        GeoLocation location;
        string locationName;
    }

    struct Product {
        string productId;
        string name;
        string batch;
        string origin;
        string manufacturer;
        string manufacturerDate;
        string description;
        address creator;
        uint256 createdAt;
        bool exists;
        uint256 scanCount;
    }

    mapping(string => Product) public products;
    mapping(string => ProductEvent[]) public productEvents;
    string[] public productIds;

    event ProductCreated(string productId, address creator, uint256 timestamp);
    event ProductUpdated(string productId, address updater, string action, uint256 timestamp);
    event ProductScanned(string productId, address scanner, int256 lat, int256 lng, uint256 timestamp);

    modifier productExists(string memory _productId) {
        require(products[_productId].exists, "Product does not exist");
        _;
    }

    function createProduct(
        string memory _productId,
        string memory _name,
        string memory _batch,
        string memory _origin,
        string memory _manufacturer,
        string memory _manufacturerDate,
        string memory _description,
        int256 _lat,
        int256 _lng,
        string memory _locationName
    ) external {
        require(!products[_productId].exists, "Product already exists");

        products[_productId] = Product({
            productId: _productId,
            name: _name,
            batch: _batch,
            origin: _origin,
            manufacturer: _manufacturer,
            manufacturerDate: _manufacturerDate,
            description: _description,
            creator: msg.sender,
            createdAt: block.timestamp,
            exists: true,
            scanCount: 0
        });

        productIds.push(_productId);

        productEvents[_productId].push(ProductEvent({
            owner: msg.sender,
            role: "Manufacturer",
            action: "Product Created",
            location: GeoLocation(_lat, _lng, block.timestamp),
            locationName: _locationName
        }));

        emit ProductCreated(_productId, msg.sender, block.timestamp);
    }

    function addEvent(
        string memory _productId,
        string memory _role,
        string memory _action,
        int256 _lat,
        int256 _lng,
        string memory _locationName
    ) external productExists(_productId) {
        productEvents[_productId].push(ProductEvent({
            owner: msg.sender,
            role: _role,
            action: _action,
            location: GeoLocation(_lat, _lng, block.timestamp),
            locationName: _locationName
        }));

        emit ProductUpdated(_productId, msg.sender, _action, block.timestamp);
    }

    function scanProduct(
        string memory _productId,
        int256 _lat,
        int256 _lng
    ) external productExists(_productId) {
        products[_productId].scanCount++;
        emit ProductScanned(_productId, msg.sender, _lat, _lng, block.timestamp);
    }

    function getProduct(string memory _productId) external view returns (Product memory) {
        return products[_productId];
    }

    function getEventCount(string memory _productId) external view returns (uint256) {
        return productEvents[_productId].length;
    }

    function getEvent(string memory _productId, uint256 _index) external view returns (ProductEvent memory) {
        return productEvents[_productId][_index];
    }

    function getTotalProducts() external view returns (uint256) {
        return productIds.length;
    }
}
