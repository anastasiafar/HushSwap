import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../styles/Header.css';

export function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-eyebrow">Confidential swap on Sepolia</span>
        <h1 className="brand-title">HushSwap</h1>
        <p className="brand-subtitle">
          Swap wETH for wZama at a fixed 1:1000 rate. Balances stay encrypted until you choose to decrypt.
        </p>
      </div>
      <div className="header-actions">
        <ConnectButton />
      </div>
    </header>
  );
}
