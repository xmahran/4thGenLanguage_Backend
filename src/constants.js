const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmODZhN2U3NC0yOTYwLTQyNDMtYWVmZi1iZWZhMTY5NThmMmIiLCJlbWFpbCI6Im1vaGFtZWQubWFocmFuMjIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxNTY3NmM1M2IzYjJkZDFhZjA5MCIsInNjb3BlZEtleVNlY3JldCI6ImY1MDExZDhmNTIxOTc0ZGE2MDc1MzU0M2JkMjk1ZGRhOWVmN2RhYWEwYjU5YTY2MjdkYTE2NGEzNTc4NDk3OGMiLCJpYXQiOjE3MTI1Mjc2Mzd9.RjPLMC_wKkYk6lcYcSxN-A55PMmC9JoCIhznw_I5wUM";
const contractAddress = "0xC3cb0093B42A5994173477AFD9a47E78771982D9"; // if we want to deploy it

const bytecode =
  "608060405234801562000010575f80fd5b506040516200112638038062001126833981016040819052620000339162000216565b5f620000408482620003f5565b5060016200004f8382620003f5565b508051600280546001600160a01b0319166001600160a01b039092169190911781556020820151829190600390620000889082620003f5565b50604082015160028201906200009f9082620003f5565b5060608201516003820190620000b69082620003f5565b5060808201516004820180546001600160a01b0319166001600160a01b0390921691909117905560a08201516005820190620000f39082620003f5565b50905050505050620004c1565b634e487b7160e01b5f52604160045260245ffd5b60405160c081016001600160401b038111828210171562000139576200013962000100565b60405290565b604051601f8201601f191681016001600160401b03811182821017156200016a576200016a62000100565b604052919050565b5f82601f83011262000182575f80fd5b81516001600160401b038111156200019e576200019e62000100565b6020620001b4601f8301601f191682016200013f565b8281528582848701011115620001c8575f80fd5b5f5b83811015620001e7578581018301518282018401528201620001ca565b505f928101909101919091529392505050565b80516001600160a01b038116811462000211575f80fd5b919050565b5f805f6060848603121562000229575f80fd5b83516001600160401b038082111562000240575f80fd5b6200024e8783880162000172565b9450602086015191508082111562000264575f80fd5b620002728783880162000172565b9350604086015191508082111562000288575f80fd5b9085019060c082880312156200029c575f80fd5b620002a662000114565b620002b183620001fa565b8152602083015182811115620002c5575f80fd5b620002d38982860162000172565b602083015250604083015182811115620002eb575f80fd5b620002f98982860162000172565b60408301525060608301518281111562000311575f80fd5b6200031f8982860162000172565b6060830152506200033360808401620001fa565b608082015260a0830151828111156200034a575f80fd5b620003588982860162000172565b60a0830152508093505050509250925092565b600181811c908216806200038057607f821691505b6020821081036200039f57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f821115620003f057805f5260205f20601f840160051c81016020851015620003cc5750805b601f840160051c820191505b81811015620003ed575f8155600101620003d8565b50505b505050565b81516001600160401b0381111562000411576200041162000100565b62000429816200042284546200036b565b84620003a5565b602080601f8311600181146200045f575f8415620004475750858301515b5f19600386901b1c1916600185901b178555620004b9565b5f85815260208120601f198616915b828110156200048f578886015182559484019460019091019084016200046e565b5085821015620004ad57878501515f19600388901b60f8161c191681555b505060018460011b0185555b505050505050565b610c5780620004cf5f395ff3fe608060405234801561000f575f80fd5b5060043610610085575f3560e01c8063aa8c217c11610058578063aa8c217c146100de578063cb2ef6f7146100f5578063ce4438cb146100fd578063f2a4a82e14610105575f80fd5b806308551a53146100895780637150d8ae146100ac57806375d0c0dc146100b45780637af8d321146100c9575b5f80fd5b610091610121565b6040516100a396959493929190610883565b60405180910390f35b610091610379565b6100bc610397565b6040516100a391906108f4565b6100dc6100d7366004610921565b610422565b005b6100e760165481565b6040519081526020016100a3565b6100bc6104b0565b6100bc6104bd565b61010d6104ca565b6040516100a39897969594939291906109cc565b60088054600980546001600160a01b03909216929161013f90610a6b565b80601f016020809104026020016040519081016040528092919081815260200182805461016b90610a6b565b80156101b65780601f1061018d576101008083540402835291602001916101b6565b820191905f5260205f20905b81548152906001019060200180831161019957829003601f168201915b5050505050908060020180546101cb90610a6b565b80601f01602080910402602001604051908101604052809291908181526020018280546101f790610a6b565b80156102425780601f1061021957610100808354040283529160200191610242565b820191905f5260205f20905b81548152906001019060200180831161022557829003601f168201915b50505050509080600301805461025790610a6b565b80601f016020809104026020016040519081016040528092919081815260200182805461028390610a6b565b80156102ce5780601f106102a5576101008083540402835291602001916102ce565b820191905f5260205f20905b8154815290600101906020018083116102b157829003601f168201915b505050600484015460058501805494956001600160a01b039092169491935091506102f890610a6b565b80601f016020809104026020016040519081016040528092919081815260200182805461032490610a6b565b801561036f5780601f106103465761010080835404028352916020019161036f565b820191905f5260205f20905b81548152906001019060200180831161035257829003601f168201915b5050505050905086565b60028054600380546001600160a01b03909216929161013f90610a6b565b5f80546103a390610a6b565b80601f01602080910402602001604051908101604052809291908181526020018280546103cf90610a6b565b801561041a5780601f106103f15761010080835404028352916020019161041a565b820191905f5260205f20905b8154815290600101906020018083116103fd57829003601f168201915b505050505081565b8051602082012060405161043890600790610aa3565b6040518091039020036104a05760405162461bcd60e51b815260206004820152602660248201527f46696c6520616c72656164792065786973747320666f722074686520676976656044820152656e206e616d6560d01b606482015260840160405180910390fd5b60056104ac8282610b61565b5050565b600180546103a390610a6b565b601780546103a390610a6b565b600e805481906104d990610a6b565b80601f016020809104026020016040519081016040528092919081815260200182805461050590610a6b565b80156105505780601f1061052757610100808354040283529160200191610550565b820191905f5260205f20905b81548152906001019060200180831161053357829003601f168201915b50505050509080600101805461056590610a6b565b80601f016020809104026020016040519081016040528092919081815260200182805461059190610a6b565b80156105dc5780601f106105b3576101008083540402835291602001916105dc565b820191905f5260205f20905b8154815290600101906020018083116105bf57829003601f168201915b505050600284015460038501805494956001600160a01b0390921694919350915061060690610a6b565b80601f016020809104026020016040519081016040528092919081815260200182805461063290610a6b565b801561067d5780601f106106545761010080835404028352916020019161067d565b820191905f5260205f20905b81548152906001019060200180831161066057829003601f168201915b50505050509080600401805461069290610a6b565b80601f01602080910402602001604051908101604052809291908181526020018280546106be90610a6b565b80156107095780601f106106e057610100808354040283529160200191610709565b820191905f5260205f20905b8154815290600101906020018083116106ec57829003601f168201915b50505050509080600501805461071e90610a6b565b80601f016020809104026020016040519081016040528092919081815260200182805461074a90610a6b565b80156107955780601f1061076c57610100808354040283529160200191610795565b820191905f5260205f20905b81548152906001019060200180831161077857829003601f168201915b505050600684015460078501805494956001600160a01b039092169491935091506107bf90610a6b565b80601f01602080910402602001604051908101604052809291908181526020018280546107eb90610a6b565b80156108365780601f1061080d57610100808354040283529160200191610836565b820191905f5260205f20905b81548152906001019060200180831161081957829003601f168201915b5050505050905088565b5f81518084525f5b8181101561086457602081850181015186830182015201610848565b505f602082860101526020601f19601f83011685010191505092915050565b5f60018060a01b03808916835260c060208401526108a460c0840189610840565b83810360408501526108b68189610840565b905083810360608501526108ca8188610840565b9050818616608085015283810360a08501526108e68186610840565b9a9950505050505050505050565b602081525f6109066020830184610840565b9392505050565b634e487b7160e01b5f52604160045260245ffd5b5f60208284031215610931575f80fd5b813567ffffffffffffffff80821115610948575f80fd5b818401915084601f83011261095b575f80fd5b81358181111561096d5761096d61090d565b604051601f8201601f19908116603f011681019083821181831017156109955761099561090d565b816040528281528760208487010111156109ad575f80fd5b826020860160208301375f928101602001929092525095945050505050565b5f6101008083526109df8184018c610840565b905082810360208401526109f3818b610840565b6001600160a01b038a811660408601528482036060860152909150610a18828a610840565b91508382036080850152610a2c8289610840565b915083820360a0850152610a408288610840565b90861660c085015283810360e08501529050610a5c8185610840565b9b9a5050505050505050505050565b600181811c90821680610a7f57607f821691505b602082108103610a9d57634e487b7160e01b5f52602260045260245ffd5b50919050565b5f808354610ab081610a6b565b60018281168015610ac85760018114610add57610b09565b60ff1984168752821515830287019450610b09565b875f526020805f205f5b85811015610b005781548a820152908401908201610ae7565b50505082870194505b50929695505050505050565b601f821115610b5c57805f5260205f20601f840160051c81016020851015610b3a5750805b601f840160051c820191505b81811015610b59575f8155600101610b46565b50505b505050565b815167ffffffffffffffff811115610b7b57610b7b61090d565b610b8f81610b898454610a6b565b84610b15565b602080601f831160018114610bc2575f8415610bab5750858301515b5f19600386901b1c1916600185901b178555610c19565b5f85815260208120601f198616915b82811015610bf057888601518255948401946001909101908401610bd1565b5085821015610c0d57878501515f19600388901b60f8161c191681555b505060018460011b0185555b50505050505056fea26469706673582212200ea72043b9a9ce67d635a8a149f08a16217f67a8fbf1c45ccd7593b3d313c53664736f6c63430008180033";

const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "stepProcess",
        type: "string",
      },
      {
        internalType: "string",
        name: "party",
        type: "string",
      },
    ],
    name: "addStep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_contractName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_contractType",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "ethAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "identityProofType",
            type: "string",
          },
          {
            internalType: "string",
            name: "identityProofImg",
            type: "string",
          },
          {
            internalType: "string",
            name: "identityProofImgHash",
            type: "string",
          },
          {
            internalType: "address",
            name: "identityProofOracle",
            type: "address",
          },
          {
            internalType: "string",
            name: "identityProofOracleHash",
            type: "string",
          },
          {
            internalType: "bool",
            name: "verified",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct BilateralSalesContract.Seller",
        name: "seller",
        type: "tuple",
      },
    ],
    name: "BuyerIDVerified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "itemProofImg",
            type: "string",
          },
          {
            internalType: "string",
            name: "itemProofImgHash",
            type: "string",
          },
          {
            internalType: "address",
            name: "imgOracle",
            type: "address",
          },
          {
            internalType: "string",
            name: "imgOracleHash",
            type: "string",
          },
          {
            internalType: "bool",
            name: "verified",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct BilateralSalesContract.Item",
        name: "item",
        type: "tuple",
      },
    ],
    name: "ItemVerified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "ethAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "identityProofType",
            type: "string",
          },
          {
            internalType: "string",
            name: "identityProofImg",
            type: "string",
          },
          {
            internalType: "string",
            name: "identityProofImgHash",
            type: "string",
          },
          {
            internalType: "address",
            name: "identityProofOracle",
            type: "address",
          },
          {
            internalType: "string",
            name: "identityProofOracleHash",
            type: "string",
          },
          {
            internalType: "bool",
            name: "verified",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct BilateralSalesContract.Seller",
        name: "seller",
        type: "tuple",
      },
    ],
    name: "SellerIDVerified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "stepProcess",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "party",
        type: "string",
      },
    ],
    name: "StepAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "stepNumber",
        type: "uint256",
      },
    ],
    name: "stepCompleted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "party",
            type: "string",
          },
          {
            internalType: "string",
            name: "stepProcess",
            type: "string",
          },
          {
            internalType: "string",
            name: "status",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct BilateralSalesContract.Step",
        name: "step",
        type: "tuple",
      },
    ],
    name: "StepCompleted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "oracleAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "oracleVerificationHash",
        type: "string",
      },
    ],
    name: "verifyBuyerIdentity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "oracleAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "oracleVerificationHash",
        type: "string",
      },
    ],
    name: "verifyItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "oracleAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "oracleVerificationHash",
        type: "string",
      },
    ],
    name: "verifySellerIdentity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "amount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "buyer",
    outputs: [
      {
        internalType: "address",
        name: "ethAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "identityProofType",
        type: "string",
      },
      {
        internalType: "string",
        name: "identityProofImg",
        type: "string",
      },
      {
        internalType: "string",
        name: "identityProofImgHash",
        type: "string",
      },
      {
        internalType: "address",
        name: "identityProofOracle",
        type: "address",
      },
      {
        internalType: "string",
        name: "identityProofOracleHash",
        type: "string",
      },
      {
        internalType: "bool",
        name: "verified",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "contractSteps",
    outputs: [
      {
        internalType: "string",
        name: "party",
        type: "string",
      },
      {
        internalType: "string",
        name: "stepProcess",
        type: "string",
      },
      {
        internalType: "string",
        name: "status",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractType",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "item",
    outputs: [
      {
        internalType: "string",
        name: "itemProofImg",
        type: "string",
      },
      {
        internalType: "string",
        name: "itemProofImgHash",
        type: "string",
      },
      {
        internalType: "address",
        name: "imgOracle",
        type: "address",
      },
      {
        internalType: "string",
        name: "imgOracleHash",
        type: "string",
      },
      {
        internalType: "bool",
        name: "verified",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "seller",
    outputs: [
      {
        internalType: "address",
        name: "ethAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "identityProofType",
        type: "string",
      },
      {
        internalType: "string",
        name: "identityProofImg",
        type: "string",
      },
      {
        internalType: "string",
        name: "identityProofImgHash",
        type: "string",
      },
      {
        internalType: "address",
        name: "identityProofOracle",
        type: "address",
      },
      {
        internalType: "string",
        name: "identityProofOracleHash",
        type: "string",
      },
      {
        internalType: "bool",
        name: "verified",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "transferDate",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
module.exports = {
  contractABI,
  contractAddress,
  bytecode,
  JWT,
};
