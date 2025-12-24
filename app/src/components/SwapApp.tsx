import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { useAccount, useReadContract } from 'wagmi';

import { Header } from './Header';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { SWAP_ABI, SWAP_ADDRESS, WETH_ABI, WETH_ADDRESS, WZAMA_ABI, WZAMA_ADDRESS } from '../config/contracts';
import '../styles/SwapApp.css';

// const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';

type TokenKey = 'weth' | 'wzama';

export function SwapApp() {
  const { address, isConnected } = useAccount();
  const signer = useEthersSigner();
  const { instance, isLoading: isZamaLoading, error: zamaError } = useZamaInstance();

  const [swapAmount, setSwapAmount] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [seedAmount, setSeedAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [decrypting, setDecrypting] = useState<Record<TokenKey, boolean>>({ weth: false, wzama: false });
  const [decryptedBalances, setDecryptedBalances] = useState<Record<TokenKey, string | null>>({
    weth: null,
    wzama: null,
  });

  const isConfigured =true
  const swapAddress = SWAP_ADDRESS as `0x${string}`;
  const wethAddress = WETH_ADDRESS as `0x${string}`;
  const wzamaAddress = WZAMA_ADDRESS as `0x${string}`;

  const { data: swapRateData } = useReadContract({
    address: swapAddress,
    abi: SWAP_ABI,
    functionName: 'swapRate',
    query: {
      enabled: isConfigured,
    },
  });

  const { data: wethBalance } = useReadContract({
    address: wethAddress,
    abi: WETH_ABI,
    functionName: 'confidentialBalanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConfigured && !!address,
    },
  });

  const { data: wzamaBalance } = useReadContract({
    address: wzamaAddress,
    abi: WZAMA_ABI,
    functionName: 'confidentialBalanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConfigured && !!address,
    },
  });

  const swapRate = swapRateData ?? 1000n;

  const expectedOutput = useMemo(() => {
    if (!swapAmount.trim()) {
      return '--';
    }
    if (!/^\d+$/.test(swapAmount.trim())) {
      return 'Invalid input';
    }
    return (BigInt(swapAmount.trim()) * swapRate).toString();
  }, [swapAmount, swapRate]);

  useEffect(() => {
    setDecryptedBalances({ weth: null, wzama: null });
  }, [address, wethBalance, wzamaBalance]);

  const handleSwap = async () => {
    setStatusMessage(null);
    if (!isConfigured) {
      setStatusMessage('Contract addresses are not configured yet.');
      return;
    }
    if (!address || !instance || !signer) {
      setStatusMessage('Connect your wallet and wait for encryption to initialize.');
      return;
    }
    if (!/^\d+$/.test(swapAmount.trim())) {
      setStatusMessage('Enter a whole-number amount to swap.');
      return;
    }

    const amount = BigInt(swapAmount.trim());
    if (amount <= 0n) {
      setStatusMessage('Amount must be greater than zero.');
      return;
    }

    setIsSwapping(true);
    try {
      const input = instance.createEncryptedInput(wethAddress, address);
      input.add64(amount);
      const encryptedInput = await input.encrypt();

      const resolvedSigner = await signer;
      if (!resolvedSigner) {
        throw new Error('Signer not available');
      }

      const wethContract = new ethers.Contract(wethAddress, WETH_ABI, resolvedSigner);
      const tx = await wethContract.confidentialTransferAndCall(
        swapAddress,
        encryptedInput.handles[0],
        encryptedInput.inputProof,
        '0x',
      );
      await tx.wait();

      setStatusMessage('Swap submitted. Your wZama will arrive after confirmation.');
      setSwapAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
      setStatusMessage(`Swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleMint = async () => {
    setStatusMessage(null);
    if (!isConfigured) {
      setStatusMessage('Contract addresses are not configured yet.');
      return;
    }
    if (!address || !signer) {
      setStatusMessage('Connect your wallet to mint wETH.');
      return;
    }
    if (!/^\d+$/.test(mintAmount.trim())) {
      setStatusMessage('Enter a whole-number amount to mint.');
      return;
    }
    const amount = BigInt(mintAmount.trim());
    if (amount <= 0n) {
      setStatusMessage('Amount must be greater than zero.');
      return;
    }

    setIsMinting(true);
    try {
      const resolvedSigner = await signer;
      if (!resolvedSigner) {
        throw new Error('Signer not available');
      }
      const wethContract = new ethers.Contract(wethAddress, WETH_ABI, resolvedSigner);
      const tx = await wethContract.mint(address, amount);
      await tx.wait();
      setStatusMessage('wETH minted to your wallet.');
      setMintAmount('');
    } catch (error) {
      console.error('Mint failed:', error);
      setStatusMessage(`Mint failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsMinting(false);
    }
  };

  const handleSeedPool = async () => {
    setStatusMessage(null);
    if (!isConfigured) {
      setStatusMessage('Contract addresses are not configured yet.');
      return;
    }
    if (!signer) {
      setStatusMessage('Connect your wallet to seed the pool.');
      return;
    }
    if (!/^\d+$/.test(seedAmount.trim())) {
      setStatusMessage('Enter a whole-number amount to seed.');
      return;
    }

    const amount = BigInt(seedAmount.trim());
    if (amount <= 0n) {
      setStatusMessage('Amount must be greater than zero.');
      return;
    }

    setIsSeeding(true);
    try {
      const resolvedSigner = await signer;
      if (!resolvedSigner) {
        throw new Error('Signer not available');
      }
      const wzamaContract = new ethers.Contract(wzamaAddress, WZAMA_ABI, resolvedSigner);
      const tx = await wzamaContract.mint(swapAddress, amount);
      await tx.wait();
      setStatusMessage('wZama minted to the swap pool.');
      setSeedAmount('');
    } catch (error) {
      console.error('Seed failed:', error);
      setStatusMessage(`Seed failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const decryptBalance = async (tokenKey: TokenKey, encryptedBalance?: string, tokenAddress?: string) => {
    setStatusMessage(null);
    if (!encryptedBalance || !tokenAddress) {
      setStatusMessage('Balance not available yet.');
      return;
    }
    if (encryptedBalance === ZERO_HASH) {
      setDecryptedBalances((prev) => ({ ...prev, [tokenKey]: '0' }));
      return;
    }
    if (!instance || !address || !signer) {
      setStatusMessage('Connect your wallet and wait for encryption to initialize.');
      return;
    }

    setDecrypting((prev) => ({ ...prev, [tokenKey]: true }));
    try {
      const keypair = instance.generateKeypair();
      const handleContractPairs = [
        {
          handle: encryptedBalance,
          contractAddress: tokenAddress,
        },
      ];

      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '7';
      const contractAddresses = [tokenAddress];

      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);
      const resolvedSigner = await signer;
      if (!resolvedSigner) {
        throw new Error('Signer not available');
      }

      const signature = await resolvedSigner.signTypedData(
        eip712.domain,
        {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
        },
        eip712.message,
      );

      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays,
      );

      const decrypted = result[encryptedBalance] ?? result[encryptedBalance.toLowerCase()];
      setDecryptedBalances((prev) => ({ ...prev, [tokenKey]: decrypted ? decrypted.toString() : '0' }));
    } catch (error) {
      console.error('Decrypt failed:', error);
      setStatusMessage(`Decrypt failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDecrypting((prev) => ({ ...prev, [tokenKey]: false }));
    }
  };

  return (
    <div className="swap-app">
      <Header />
      <main className="swap-main">
        {!isConfigured && (
          <div className="banner warning">
            Contracts are not configured. Update addresses in <code>app/src/config/contracts.ts</code> after deployment.
          </div>
        )}
        {zamaError && <div className="banner error">Encryption service error: {zamaError}</div>}
        {statusMessage && <div className="banner info">{statusMessage}</div>}

        <section className="summary-grid">
          <div className="summary-card">
            <span className="summary-label">Swap Rate</span>
            <div className="summary-value">1 wETH - {'>'} {swapRate.toString()} wZama</div>
            <p className="summary-note">Fixed-rate conversion, no slippage.</p>
          </div>
          <div className="summary-card">
            <span className="summary-label">Encryption</span>
            <div className="summary-value">{isZamaLoading ? 'Initializing' : 'Ready'}</div>
            <p className="summary-note">Balances stay encrypted until you decrypt them.</p>
          </div>
        </section>

        <section className="main-grid">
          <div className="card">
            <div className="card-header">
              <h2>Encrypted Balances</h2>
              <p>Read-only using viem. Decrypt with your wallet signature.</p>
            </div>
            <div className="balance-list">
              <div className="balance-item">
                <div>
                  <span className="token-label">wETH</span>
                  <span className="token-hash">{wethBalance ? wethBalance.toString() : '--'}</span>
                </div>
                <div className="token-actions">
                  <button
                    className="ghost-button"
                    disabled={!isConnected || !instance || decrypting.weth}
                    onClick={() =>
                      decryptBalance('weth', wethBalance as string | undefined, WETH_ADDRESS)
                    }
                  >
                    {decrypting.weth ? 'Decrypting...' : 'Decrypt'}
                  </button>
                  <span className="token-decrypted">
                    {decryptedBalances.weth ? `=${decryptedBalances.weth}` : 'Hidden'}
                  </span>
                </div>
              </div>
              <div className="balance-item">
                <div>
                  <span className="token-label">wZama</span>
                  <span className="token-hash">{wzamaBalance ? wzamaBalance.toString() : '--'}</span>
                </div>
                <div className="token-actions">
                  <button
                    className="ghost-button"
                    disabled={!isConnected || !instance || decrypting.wzama}
                    onClick={() =>
                      decryptBalance('wzama', wzamaBalance as string | undefined, WZAMA_ADDRESS)
                    }
                  >
                    {decrypting.wzama ? 'Decrypting...' : 'Decrypt'}
                  </button>
                  <span className="token-decrypted">
                    {decryptedBalances.wzama ? `=${decryptedBalances.wzama}` : 'Hidden'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card swap-card">
            <div className="card-header">
              <h2>Swap wETH - {'>'} wZama</h2>
              <p>Uses confidentialTransferAndCall from wETH with encrypted input.</p>
            </div>
            <label className="field-label" htmlFor="swap-amount">
              Amount (whole units)
            </label>
            <input
              id="swap-amount"
              className="text-input"
              placeholder="e.g. 2"
              value={swapAmount}
              onChange={(event) => setSwapAmount(event.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <div className="swap-preview">
              <span>Estimated output</span>
              <strong>{expectedOutput} wZama</strong>
            </div>
            <button
              className="primary-button"
              disabled={!isConnected || !instance || isSwapping}
              onClick={handleSwap}
            >
              {isSwapping ? 'Swapping...' : 'Encrypt & Swap'}
            </button>
            <p className="footnote">
              The swap pool must hold wZama. Seed it below before swapping.
            </p>
          </div>
        </section>

        <section className="main-grid">
          <div className="card">
            <div className="card-header">
              <h2>Mint wETH</h2>
              <p>Get test wETH for swapping.</p>
            </div>
            <label className="field-label" htmlFor="mint-amount">
              Amount
            </label>
            <input
              id="mint-amount"
              className="text-input"
              placeholder="e.g. 5"
              value={mintAmount}
              onChange={(event) => setMintAmount(event.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <button className="secondary-button" disabled={!isConnected || isMinting} onClick={handleMint}>
              {isMinting ? 'Minting...' : 'Mint wETH'}
            </button>
          </div>
          <div className="card">
            <div className="card-header">
              <h2>Seed wZama Pool</h2>
              <p>Provide confidential liquidity for swaps.</p>
            </div>
            <label className="field-label" htmlFor="seed-amount">
              Amount
            </label>
            <input
              id="seed-amount"
              className="text-input"
              placeholder="e.g. 5000"
              value={seedAmount}
              onChange={(event) => setSeedAmount(event.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <button className="secondary-button" disabled={!isConnected || isSeeding} onClick={handleSeedPool}>
              {isSeeding ? 'Seeding...' : 'Mint to Pool'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
