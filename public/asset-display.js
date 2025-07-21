import {
  getDatabase,
  ref,
  get,
  onValue
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Setup shared channel for cross-tab sync
const assetChannel = new BroadcastChannel('player-assets');

// 🎯 Entry point
export async function loadAndRenderAssets() {
  try {
    const walletAddress = await getWalletAddress();
    if (!walletAddress) {
      showMessage("Connect your wallet to view assets");
      return;
    }

    const db = getDatabase();
    const snapshot = await get(ref(db, `players/${walletAddress}/assets`));
    const assets = snapshot.exists() ? snapshot.val() : {};

    window.playerAssets = assets;
    localStorage.setItem(`playerAssets_${walletAddress}`, JSON.stringify(assets));

    renderAssets(assets);
    setupRealtimeUpdates(walletAddress);

  } catch (error) {
    console.error("Load failed:", error);
    const walletAddress = localStorage.getItem('lastWalletAddress');
    const fallbackAssets = walletAddress
      ? JSON.parse(localStorage.getItem(`playerAssets_${walletAddress}`)) || {}
      : {};
    renderAssets(fallbackAssets);
  }
}

function renderAssets(assets) {
  const grid = document.getElementById('assets-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const assetList = Object.values(assets).filter(a => a.quantity > 0);

  if (assetList.length === 0) {
    grid.innerHTML = '<p class="no-assets">No items in your inventory</p>';
    return;
  }

  assetList.forEach(asset => {
    const item = document.createElement('div');
    item.className = 'asset-item';
    item.innerHTML = `
      <div class="asset-image-container">
        <img src="${asset.image || 'default-item.png'}" alt="${asset.name}" class="asset-image">
      </div>
      <div class="asset-details">
        <h3 class="asset-name">${asset.name} <span class="asset-quantity">×${asset.quantity}</span></h3>
        <p class="asset-description">${asset.description}</p>
      </div>
    `;
    grid.appendChild(item);
  });
}

function setupRealtimeUpdates(walletAddress) {
  const db = getDatabase();
  const assetRef = ref(db, `players/${walletAddress}/assets`);

  onValue(assetRef, (snapshot) => {
    const assets = snapshot.exists() ? snapshot.val() : {};
    window.playerAssets = assets;

    renderAssets(assets);
    assetChannel.postMessage(assets);
    localStorage.setItem(`playerAssets_${walletAddress}`, JSON.stringify(assets));
  });
}

async function getWalletAddress() {
  if (!window.ethereum) return null;
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const address = accounts[0]?.toLowerCase();
    localStorage.setItem('lastWalletAddress', address);
    return address;
  } catch (error) {
    console.error("Wallet error:", error);
    return null;
  }
}

function showMessage(msg) {
  const grid = document.getElementById('assets-grid');
  if (grid) {
    grid.innerHTML = `<p class="no-assets">${msg}</p>`;
  }
}

// Optional: cross-tab sync
assetChannel.onmessage = (e) => {
  window.playerAssets = e.data;
  renderAssets(e.data);
};

window.addEventListener('storage', (e) => {
  if (e.key?.startsWith('playerAssets_')) {
    window.playerAssets = JSON.parse(e.newValue || '{}');
    renderAssets(window.playerAssets);
  }
});
