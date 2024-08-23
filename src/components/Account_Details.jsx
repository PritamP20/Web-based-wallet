import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import * as bip39 from 'bip39'
import { Connection, PublicKey, Keypair, clusterApiUrl } from '@solana/web3.js';
import { Buffer } from 'buffer';


const Account_Details = ({blockChain, mnemonics,walletAddress, setWalletAddress}) => {
    window.Buffer = Buffer;
    const [privateKey, setPrivateKey] = useState()
    const [publicKey, setPublicKey] = useState()
    

    const Wallet_ETH = ()=>{
        console.log(mnemonics)
        const wallet = ethers.Wallet.fromPhrase(mnemonics);
        setWalletAddress(wallet.address)
        setPublicKey(wallet.publicKey)
        localStorage.setItem("Public_Key",JSON.stringify({"PUBLIC_KEY":wallet.publicKey}))
        setPrivateKey(wallet.privateKey);
    }

    const Wallet_SOL = ()=>{
        const seed = bip39.mnemonicToSeedSync(mnemonics);
        const KeyPair = Keypair.fromSeed(seed);

        setPublicKey(KeyPair.publicKey)
        localStorage.setItem("Public_key", JSON.stringify({"PUBLIC_KEY":KeyPair.publicKey}))

        const uint8_private = KeyPair.privateKey;
        setPrivateKey(Buffer.from(uint8_private).toString('hex'))
    }

    const create_account = ()=>{
        if (blockChain=='Ethereum') {
            Wallet_ETH()
        }else{
            Wallet_SOL()
        }
    }

    useEffect(()=>{
        create_account()
    },[])

  return (
    <div>
      walletAddress = {walletAddress}
      privateKey = {privateKey}
      publicKey = {publicKey}
    </div>
  )
}

export default Account_Details
