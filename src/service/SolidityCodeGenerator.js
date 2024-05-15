const generateSolidity = () => {
  let code = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;
  
  contract BilateralSalesContract {
  
      struct Step {
          string party; //buyer/ seller
          string stepProcess;
          string status; //COMPLETED / INPROGRESS
      }
  
      struct Buyer {
          address ethAddress;
          string identityProofType;
          string identityProofImg;
          string identityProofImgHash;
          address identityProofOracle;
          string identityProofOracleHash;
          bool verified;
  
      }
  
      struct Seller {
          address ethAddress;
          string identityProofType;
          string identityProofImg;
          string identityProofImgHash;
          address identityProofOracle;
          string identityProofOracleHash;
          bool verified;
  
      }
  
      struct Item {
          string itemProofImg;
          string itemProofImgHash;
          address imgOracle;
          string imgOracleHash;
          bool verified;
      }
  
      bool public isCompleted;
      string public contractName;
      string public contractType;
      Step[] public contractSteps;
      Buyer public buyer;
      Seller public seller;
      Item public item;
      uint public amount;
      uint public penalty;
      string public transferDate;  
  
      event StepCompleted (
          Step step
      );
       event ItemVerified (
          Item item
      );
      event SellerIDVerified (
          Seller seller
      );
      event BuyerIDVerified (
          Seller seller
      );
      event StepAdded(string stepProcess, string party);
  
      constructor(
          string memory _contractName,
          string memory _contractType,
          Seller memory _seller,
          Item memory _item,
          Step[] memory _contractSteps,
          uint _amount,
          string memory _transferDate,
          uint _penalty
      ) {
          contractName = _contractName;
          contractType = _contractType;
          seller = _seller;
           item = _item;
          for (uint i = 0; i < _contractSteps.length; i++) {
              contractSteps.push(_contractSteps[i]);
          }
          amount = _amount;
          transferDate = _transferDate;
          penalty = _penalty;
      }
  
  
      function addBuyer(
          address ethAddress,
          string memory identityProofType,
          string memory identityProofImg,
          string memory identityProofImgHash,
          address identityProofOracle,
          string memory identityProofOracleHash,
          bool verified
      ) external {
          Buyer memory newBuyer = Buyer(
              ethAddress,
              identityProofType,
              identityProofImg,
              identityProofImgHash,
              identityProofOracle,
              identityProofOracleHash,
              verified
          );
          buyer = newBuyer;
      }
  
      function addStep(string memory stepProcess, string memory party) external {
          contractSteps.push(Step(party, stepProcess,"INPROGRESS"));
          emit StepAdded(stepProcess, party);
      }
      function stepCompleted(uint stepNumber) external  {
          contractSteps[stepNumber].status = "COMPLETED";
          emit StepCompleted(contractSteps[stepNumber]);
      }
      function verifyItem(address oracleAddress, string memory oracleVerificationHash) external  {
          item.verified = true;
          item.imgOracle = oracleAddress;
          item.imgOracleHash = oracleVerificationHash;
          emit ItemVerified(item);
      }
      function verifySellerIdentity(address oracleAddress, string memory oracleVerificationHash) external {
          seller.identityProofOracle = oracleAddress;
          seller.identityProofOracleHash = oracleVerificationHash;
          seller.verified = true;
          emit SellerIDVerified(seller);
      }
      function verifyBuyerIdentity(address oracleAddress, string memory oracleVerificationHash) external {
          buyer.identityProofOracle = oracleAddress;
          buyer.identityProofOracleHash = oracleVerificationHash;
          buyer.verified = true;
          emit BuyerIDVerified(seller);(seller);
      }
  
       modifier onlyNotCompleted() {
          require(!isCompleted, "Contract is already completed");
          _;
      }
      function markAsCompleted() external onlyNotCompleted {
          isCompleted = true;
      }
  }`;
  return code;
};

module.exports = { generateSolidity };
