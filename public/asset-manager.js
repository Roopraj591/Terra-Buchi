import {
  getDatabase,
  ref,
  get,
  set,
  update
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

async function getWalletAddress() {
  if (!window.ethereum) throw new Error("No Ethereum provider");
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const address = accounts[0]?.toLowerCase();
  localStorage.setItem('lastWalletAddress', address);
  return address;
}

function updateLocalCache(walletAddress, key, assetData) {
  const cacheKey = `playerAssets_${walletAddress}`;
  const cache = JSON.parse(localStorage.getItem(cacheKey)) || {};
  cache[key] = assetData;
  localStorage.setItem(cacheKey, JSON.stringify(cache));
}

function fallbackToLocalStorage(_key, _name, _image, _description, _tokenId, _quantity) {
  const walletAddress = localStorage.getItem('lastWalletAddress');
  if (!walletAddress) return;

  const storageKey = `playerAssets_${walletAddress}`;
  const playerAssets = JSON.parse(localStorage.getItem(storageKey)) || {};

  playerAssets[_key] = playerAssets[_key] || {
    name: _name,
    image: _image,
    description: _description,
    tokenId: _tokenId,
    quantity: 0
  };
  playerAssets[_key].quantity += _quantity;
  localStorage.setItem(storageKey, JSON.stringify(playerAssets));
}

async function AssetHolder(_key, _name, _image, _description, _tokenId, _quantity) {
  try {
    const walletAddress = await getWalletAddress();
    if (!walletAddress) throw new Error("No wallet address");

    const db = getDatabase();
    const assetRef = ref(db, `players/${walletAddress}/assets/${_key}`);
    const snapshot = await get(assetRef);

    const existingQty = snapshot.exists() ? snapshot.val().quantity : 0;
    const newQty = existingQty + _quantity;

    if (!snapshot.exists()) {
      await set(assetRef, {
        name: _name,
        image: _image,
        description: _description,
        tokenId: _tokenId,
        quantity: newQty,
        owner: walletAddress,
        lastUpdated: Date.now()
      });
    } else {
      await update(assetRef, {
        quantity: newQty,
        lastUpdated: Date.now()
      });
    }

    updateLocalCache(walletAddress, _key, {
      name: _name,
      image: _image,
      description: _description,
      tokenId: _tokenId,
      quantity: newQty
    });

    return { success: true };
  } catch (error) {
    console.error("Save failed:", error);
    fallbackToLocalStorage(_key, _name, _image, _description, _tokenId, _quantity);
    return { success: false, error: error.message };
  }
}

async function loadPlayerAssets() {
  try {
    const walletAddress = await getWalletAddress();
    if (!walletAddress) return {};

    const db = getDatabase();
    const snapshot = await get(ref(db, `players/${walletAddress}/assets`));
    return snapshot.exists() ? snapshot.val() : {};
  } catch (error) {
    console.error("Load failed:", error);
    const walletAddress = localStorage.getItem('lastWalletAddress');
    return walletAddress
      ? JSON.parse(localStorage.getItem(`playerAssets_${walletAddress}`)) || {}
      : {};
  }
}

// ✅ Proper named export
export const AssetManager = {
  AssetHolder,
  loadPlayerAssets
};