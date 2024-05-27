// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;
  
  contract BilateralSalesContract {
  
      struct Step {
          string party; //buyer/ seller
          string stepProcess;
          string status; //VERIFIED / INPROGRESS
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
          string stepProccess,
          string party
      );
       event ItemVerified (
          string itemProofImg,
          address verifier
      );
      event SellerIDVerified (
          address ethAddress,
          string identityProofImg,
          address verifier
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
          contractSteps[stepNumber].status = "VERIFIED";
          emit StepCompleted(contractSteps[stepNumber].stepProcess, contractSteps[stepNumber].party);
      }
      function verifyItem(address oracleAddress, string memory oracleVerificationHash) external  {
          item.verified = true;
          item.imgOracle = oracleAddress;
          item.imgOracleHash = oracleVerificationHash;
          emit ItemVerified(item.itemProofImg, oracleAddress);
      }
      function verifySellerIdentity(address oracleAddress, string memory oracleVerificationHash) external {
          seller.identityProofOracle = oracleAddress;
          seller.identityProofOracleHash = oracleVerificationHash;
          seller.verified = true;
          emit SellerIDVerified(seller.ethAddress, seller.identityProofImg, oracleAddress);
      }
 
      function getContractSteps() public view returns (Step[] memory) {
        return contractSteps;
      }
  
       modifier onlyNotCompleted() {
          require(!isCompleted, "Contract is already completed");
          _;
      }
      function markAsCompleted() external onlyNotCompleted {
          isCompleted = true;
      }
  }