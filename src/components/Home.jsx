import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
// import * as bip39 from 'bip39';
// import { mnemonicToSeed, generateMnemonic, mnemonicToSeedSync } from "bip39";
// import { Buffer } from 'buffer';
// import { Keypair } from '@solana/web3.js';
// import * as ed25519 from 'ed25519-hd-key';
// import nacl from 'tweetnacl';
// import * as solana from "@solana/web3.js";
// import bs58 from 'bs58';

import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import * as ed25519 from 'ed25519-hd-key';




const Home = () => {
    const [blockChain, setBlockChain] = useState(-1);

    window.Buffer = Buffer;

    const [show, setShow] = useState(false);
    const [data_Array, setData_Array] = useState([]);
    const [mnemonics, setMnemonices] = useState(bip39.generateMnemonic());

    const Wallet_ETH = (mnemonics) => {
        setData_Array(prevDataArray => {

            const rootNode = ethers.HDNodeWallet.fromPhrase(mnemonics);

            const randomNumber = Math.floor(Math.random()*1e9)
            const path = `44'/60'/0'/0/${randomNumber}`;
            console.log(`Generating wallet with path: ${path}`);

            // Derive the wallet from the HDNode using the path
            const wallet = rootNode.derivePath(path);

            console.log(`New wallet address: ${wallet.address}`);

            const dummy = {name:`wallet${randomNumber}`, privateKey: wallet.privateKey, publicKey: wallet.publicKey };

            console.log('Generated Wallet:', dummy);

            const data = {
                mnemonics: mnemonics,
                blockchainType: 1, // Ethereum
                path: path
            };

            localStorage.setItem(`wallet${randomNumber}`, JSON.stringify(data));

            return [...prevDataArray, dummy];
        });
    };

    const set_Wallets = (key, mnemonics, path) => {
        console.log(`Generating wallet with path: ${path}`);
        const rootNode = ethers.HDNodeWallet.fromPhrase(mnemonics);
        const wallet = rootNode.derivePath(path)
        const dummy = {name:`${key}`, privateKey: wallet.privateKey, publicKey: wallet.publicKey };
        console.log('Generated Wallet:', dummy);
        setData_Array(prevDataArray => [...prevDataArray, dummy]);
    };


    const [data_Array_SOL, setData_Array_SOL] = useState([]);

    // const Wallet_SOL = async () => {
    //     try {
    //         const seed = bip39.mnemonicToSeedSync(mnemonics).slice(0, 32);
    //         const keypair = solana.Keypair.fromSeed(seed);
    //         // console.log(keypair);
    
    //         const publicKey = keypair.publicKey.toString();
    //         console.log(`publicKey: ${publicKey}`);
    
    //         const privateKey = keypair.secretKey;
    //         const privateKeyHex = Buffer.from(privateKey).toString('hex');
    //         const privateKey_bs58 = bs58.encode(privateKey)
    //         console.log(`privateKey: ${privateKeyHex}`);

    //         const dummy = {name:`wallet${1}`,privateKey:privateKey_bs58, publicKey: publicKey}
    //         setData_Array_SOL(prev=>[...prev, dummy]);
    //     } catch (error) {
    //         console.error("Error in Wallet_SOL:", error);
    //     }
    // };

    // async function Wallet_SOL(mnemonic) {
    //     try {
    //         console.log(mnemonic)
    //         let seed = (await bip39.mnemonicToSeed(mnemonic));
    //         seed = seed.toString('hex');
    //         console.log(seed)
    //         const derivationPath = `m/44'/501'/0'/0'`;
    //         console.log(d) 
    //         const  d_key  = derivePath(derivationPath, seed.toString('hex'));
    //         // const keypair = Keypair.fromSecretKey(d_key);
    //         console.log(d_key)
    //         // console.log('Public Key:', keypair.publicKey.toBase58());
    //         // console.log('Secret Key:', keypair.secretKey.toString('hex'));
            
    //         // console.log(keypair)
    //     } catch (error) {
    //         console.error('Error during wallet creation:', error);
    //     }
    // }

    const Wallet_SOL =async (mnemonics)=>{
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
    }
    
    


    const local_check = () => {
        const keys = Object.keys(localStorage);
        console.log('LocalStorage keys:', keys);


        keys.forEach((key) => {
            const value = localStorage.getItem(key);
            console.log(`Processing key ${key} with value:`, value);

            try {
                const parsedValue = JSON.parse(value);
                
                if (parsedValue.blockchainType !== undefined && parsedValue.mnemonics && parsedValue.path) {
                    if(parsedValue.blockchainType==1){
                        setBlockChain(parsedValue.blockchainType);
                        setMnemonices(parsedValue.mnemonics);
                        set_Wallets(key, parsedValue.mnemonics, parsedValue.path);
                    }
                }
            } catch (error) {
                console.error("Error parsing JSON from localStorage:", error);
            }
        });
    };

    const Delete = (index) => {
        if (index < 0 || index >= data_Array.length) {
            console.error("Invalid index:", index);
            return;
        }
        const key = data_Array[index].name;
        console.log(key)
        console.log(`Key to remove: '${key}'`);

        if (localStorage.getItem(key)) {
            console.log(`Removing item with key: '${key}'`);
            localStorage.removeItem(key);
            if(localStorage.length==0){
                setBlockChain(-1)
            }
        } else {
            console.warn(`Key '${key}' not found in localStorage.`);
        }
        setData_Array(prev => prev.filter((_, i) => i !== index));
    };

    

    const onBlockChange = (block) => {
        setBlockChain(block);
        if (block === 1) {
            Wallet_ETH(mnemonics);
        }else{
            Wallet_SOL(mnemonics);
        }
    };


    useEffect(() => {
        if (blockChain !== -1) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [blockChain]);

    useEffect(() => {
        local_check();
    }, []);


    return (
        <div className="bg-black text-white">
            <div className="col-10 mx-auto">
                <div className="d-flex justify-content-between mt-4 align-items-center">
                    <h2>DeadSafe</h2>
                    <span>Dark Mode</span>
                </div>

                {blockChain === -1 ? (
                    <div className='mt-5 d-flex flex-column gap-2'>
                        <div>
                            <h1>DeadSafe supports multiple blockChains</h1>
                            <h5 className='text-secondary'>Choose a blockChain to get Started</h5>
                        </div>
                        <div className='d-flex gap-2'>
                            <button type="button" className="btn btn-light" onClick={() => onBlockChange(1)}>Ethereum</button>
                            <button type="button" className="btn btn-light" onClick={() => onBlockChange(0)}>Solana</button>
                        </div>
                    </div>
                ) : null}

                <div className={`transition fade ${show ? 'show' : ''}`}>
                    {blockChain === 1 ? (
                        <>
                            <div className='mt-5'>
                                <h1>Your Secret Phrase <button type="button" className="btn btn-dark">Copy</button></h1>
                                <h5 className='text-secondary'> {mnemonics} </h5>
                            </div>
                            <div className='mt-5'>
                                <div className='d-flex justify-content-between'>
                                    <h1>Your Account Details</h1>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <button type="button" className="btn btn-success" onClick={() => Wallet_ETH(mnemonics)}>Add Wallet</button>
                                    </div>
                                </div>
                                <h5 className='text-secondary'>Please Don't share your Private key and Secret phrase to anyone</h5>

                                {data_Array.length > 0 && data_Array.map((item, index) => (
                                    <div className='rounded-4 mt-3 border border-1 border-dark-subtle' key={index}>
                                        <h4 className='p-4 pb-2 d-flex justify-content-between'>Wallet {index + 1} <button type="button" onClick={()=>Delete(index)} className="btn btn-danger text-end">Delete</button></h4>
                                        <div className='p-4 pt-2 rounded-4 border border-1 border-dark-subtle' style={{ backgroundColor: "#212529" }}>
                                            <div>
                                                <h5>PublicKey</h5>
                                                <p> <span className='bg-black p-2 rounded-2'>{item.publicKey}</span> &nbsp; <a href="#" className='text-decoration-none'>Copy</a> </p>
                                            </div>
                                            <div>
                                                <h5>Private Key</h5>
                                                <p> <span className='bg-black p-2 rounded-2'>{item.privateKey}</span> &nbsp; <a href="#" className='text-decoration-none'>Copy</a> </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : blockChain === 0 ? (
                        <>
                            <div className='mt-5'>
                                <h1>Your Secret Phrase <button type="button" className="btn btn-dark">Copy</button></h1>
                                <h5 className='text-secondary'> {mnemonics} </h5>
                            </div>
                            <div className='mt-5'>
                                <div className='d-flex justify-content-between'>
                                    <h1>Your Account Details</h1>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <button type="button" className="btn btn-success" onClick={() => Wallet_SOL(mnemonics)}>Add Wallet</button>
                                    </div>
                                </div>
                                <h5 className='text-secondary'>Please Don't share your Private key and Secret phrase to anyone</h5>

                                {data_Array_SOL.length > 0 && data_Array_SOL.map((item, index) => (
                                    <div className='rounded-4 mt-3 border border-1 border-dark-subtle' key={index}>
                                        <h4 className='p-4 pb-2 d-flex justify-content-between'>Wallet {index + 1} <button type="button" onClick={()=>Delete(index)} className="btn btn-danger text-end">Delete</button></h4>
                                        <div className='p-4 pt-2 rounded-4 border border-1 border-dark-subtle' style={{ backgroundColor: "#212529" }}>
                                            <div>
                                                <h5>PublicKey</h5>
                                                <p> <span className='bg-black p-2 rounded-2'>{item.publicKey}</span> &nbsp; <a href="#" className='text-decoration-none'>Copy</a> </p>
                                            </div>
                                            <div>
                                                <h5>Private Key</h5>
                                                <p> <span className='bg-black p-2 rounded-2'>{item.privateKey}</span> &nbsp; <a href="#" className='text-decoration-none'>Copy</a> </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Home;