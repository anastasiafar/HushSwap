export const WETH_ADDRESS = '0x69df9253362d84b29dc44B3D420ab6a75c41985a';
export const WZAMA_ADDRESS = '0x0E6F4D1528f46A4F61b1aa3364a586D4ACFEBC66';
export const SWAP_ADDRESS = '0xe9653C89e54E28E30A8D0d85Dc06b1741635f6E5';

export const TOKEN_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'euint64',
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
    ],
    name: 'AmountDiscloseRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'euint64',
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'amount',
        type: 'uint64',
      },
    ],
    name: 'AmountDisclosed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'euint64',
        name: 'amount',
        type: 'bytes32',
      },
    ],
    name: 'ConfidentialTransfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'holder',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint48',
        name: 'until',
        type: 'uint48',
      },
    ],
    name: 'OperatorSet',
    type: 'event',
  },
  {
    inputs: [],
    name: 'confidentialTotalSupply',
    outputs: [
      {
        internalType: 'euint64',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'confidentialBalanceOf',
    outputs: [
      {
        internalType: 'euint64',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'externalEuint64',
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'inputProof',
        type: 'bytes',
      },
    ],
    name: 'confidentialTransfer',
    outputs: [
      {
        internalType: 'euint64',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'euint64',
        name: 'amount',
        type: 'bytes32',
      },
    ],
    name: 'confidentialTransfer',
    outputs: [
      {
        internalType: 'euint64',
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'externalEuint64',
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'inputProof',
        type: 'bytes',
      },
    ],
    name: 'confidentialTransferFrom',
    outputs: [
      {
        internalType: 'euint64',
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'euint64',
        name: 'amount',
        type: 'bytes32',
      },
    ],
    name: 'confidentialTransferFrom',
    outputs: [
      {
        internalType: 'euint64',
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'externalEuint64',
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'inputProof',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'confidentialTransferAndCall',
    outputs: [
      {
        internalType: 'euint64',
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'euint64',
        name: 'amount',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'confidentialTransferAndCall',
    outputs: [
      {
        internalType: 'euint64',
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'externalEuint64',
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'inputProof',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'confidentialTransferFromAndCall',
    outputs: [
      {
        internalType: 'euint64',
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'euint64',
        name: 'amount',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'confidentialTransferFromAndCall',
    outputs: [
      {
        internalType: 'euint64',
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'euint64',
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        internalType: 'uint64',
        name: 'cleartextAmount',
        type: 'uint64',
      },
      {
        internalType: 'bytes',
        name: 'decryptionProof',
        type: 'bytes',
      },
    ],
    name: 'discloseEncryptedAmount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'holder',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'isOperator',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: 'amount',
        type: 'uint64',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'euint64',
        name: 'encryptedAmount',
        type: 'bytes32',
      },
    ],
    name: 'requestDiscloseEncryptedAmount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'uint48',
        name: 'until',
        type: 'uint48',
      },
    ],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const WETH_ABI = TOKEN_ABI;
export const WZAMA_ABI = TOKEN_ABI;

export const SWAP_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wethAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'wzamaAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'euint64',
        name: 'wethIn',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'euint64',
        name: 'wzamaOut',
        type: 'bytes32',
      },
    ],
    name: 'SwapExecuted',
    type: 'event',
  },
  {
    inputs: [],
    name: 'SWAP_RATE',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'euint64',
        name: 'amount',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'onConfidentialTransferReceived',
    outputs: [
      {
        internalType: 'ebool',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'swapRate',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'weth',
    outputs: [
      {
        internalType: 'contract IERC7984',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wzama',
    outputs: [
      {
        internalType: 'contract IERC7984',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
