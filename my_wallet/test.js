import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import * as ed25519 from 'ed25519-hd-key';

// Replace with your mnemonic
const mnemonic = 'cabbage together debris chalk hammer novel wire tunnel rubber labor retire prefer';

// Convert the mnemonic to a seed
const seed = bip39.mnemonicToSeedSync(mnemonic).slice(0, 32);

// Define the derivation path
const path =`m/44'/501'/0'/0'`; // Replace with your custom path

// Derive a seed from the given path
const derivedSeed = ed25519.derivePath(path, Buffer.from(seed, 'hex')).key;

// Generate a keypair from the derived seed using tweetnacl (NaCl = Networking and Cryptography library)
const derivedUint8Keypair = nacl.sign.keyPair.fromSeed(derivedSeed);

// This is a Uint8Array, not a Solana web3.js Keypair object, so you will need to convert it
const customPathKeypair = Keypair.fromSecretKey(
  Uint8Array.from(derivedUint8Keypair.secretKey)
);

console.log('Custom Path Keypair address:', customPathKeypair.publicKey.toBase58())