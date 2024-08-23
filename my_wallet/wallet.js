import { ethers } from "ethers";
import { HDNodeWallet } from "ethers";
import * as bip39 from 'bip39';
import * as solana from "@solana/web3.js";
import bs58 from "bs58"


let walletAddress;

const mnemonics = "price price exhibit real magnet like ordinary double eternal render window brush"
// const mnemonics = "brush window render eternal price real like double tornado exhibit magnet ordinary";

export const Wallet_ETH = () => {
    try {
        const wallet = ethers.Wallet.fromPhrase(mnemonics);
        walletAddress = wallet.address;
        console.log(`wallet address: ${wallet.address}`);
        console.log(`wallet private key: ${wallet.privateKey}`);
        console.log(`wallet public key: ${wallet.publicKey}`);
    } catch (error) {
        console.error("Error in Wallet_ETH:", error);
    }
};

Wallet_ETH();

export const Wallet_SOL = async () => {
    try {
        const seed = bip39.mnemonicToSeedSync(mnemonics).slice(0, 32);
        const keypair = solana.Keypair.fromSeed(seed);
        // console.log(keypair);

        const publicKey = keypair.publicKey.toString();
        console.log(`publicKey: ${publicKey}`);

        const privateKey = keypair.secretKey;
        const privateKeyHex = Buffer.from(privateKey).toString('hex');
        console.log(`privateKey: ${privateKeyHex}`);
    } catch (error) {
        console.error("Error in Wallet_SOL:", error);
    }
};

// Wallet_SOL()

const provider = new ethers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/dDJJ1Lvt2Xyuac8UgD3xAcQekhHqtI-P", 
    {
        name: "sepolia",
        chainId: 11155111
    }
);
// const provider = new ethers.JsonRpcProvider(
//     "https://eth-mainnet.alchemyapi.io/v2/dDJJ1Lvt2Xyuac8UgD3xAcQekhHqtI-P", 
//     {
//         name: "mainnet",
//         chainId: 1
//     }
// );

export async function getBalance_eth() {
    const balance = await provider.getBalance("0x9CF6cb8A7c3B9B07564BAB8bC612785792e1FB82"); //wallet address
    // const balance = await provider.getBalance("0x07f7524a4F1d5C0ef559c582f51814Ef5816CcA5");
    console.log(ethers.formatEther(balance)+ " ETH")
}

// getBalance_eth().catch(console.error);

// const connection_sol = new solana.Connection(
//     'https://api.mainnet-beta.solana.com', // Alternative Solana RPC URL
//     'confirmed'
// );

const connection_sol = new solana.Connection(
    'https://api.testnet.solana.com', // Solana Testnet RPC URL
    'confirmed'
);


export const getBalance_sol = async (public_address) => {
    try {
        const balance = await connection_sol.getBalance(new solana.PublicKey(public_address));
        console.log('Balance: ', balance);

        const solBalance = balance / 1e9;
        console.log(`balance in SOL: ${solBalance}`);
    } catch (error) {
        console.error("Error in getBalance_sol:", error);
    }
};

// Test the connection
// getBalance_sol("CeM9p27s8owVX5e7Kgg9f3VW4Tzh7VWz4jxEgmBDEj3w");
// getBalance_sol("2zUQzdXcX7yb3AdwimiKiwTjXudSF9UFihFax95w7vbM");

//Transfer funds to eth
export const sendTransaction_ETH = async (recipient, amount, private_Key) => {
    // Convert amount from ETH to Wei
    const amount_ETH = ethers.parseEther(amount.toString());
    
    // Create a wallet instance
    const wallet = new ethers.Wallet(private_Key, provider);


    // Create a transaction object
    const tx = {
        to: recipient,
        value: amount_ETH,
        // You can also specify gas limit and gas price if needed
        // gasLimit: ethers.utils.hexlify(21000), // Standard for simple ETH transfer
        // gasPrice: await provider.getGasPrice()
    };

    try {
        // Send the transaction
        const transaction = await wallet.sendTransaction(tx);

        // Wait for the transaction to be mined
        const receipt = await transaction.wait();

        console.log("Transaction successful:", receipt);
    } catch (error) {
        console.error("Transaction failed:", error);
    }
};

// sendTransaction_ETH("0xb1F77169bd3e7374398d65543474a54d49065C01",0.0001,"8b87d9854e35388b8f6d9ffba30c5316958e89fdae04326d914f411b463d4b08")

export const sendTransaction_SOL = async(sender_PrivateKey, Recipient_PublicKey, amount)=>{

    let sender_Private_KEY_Uint8;
    if(sender_PrivateKey.length == 128){
        sender_Private_KEY_Uint8 = Uint8Array.from(Buffer.from(sender_PrivateKey, 'hex'));
    }else{
        sender_Private_KEY_Uint8 = bs58.decode(sender_PrivateKey)
    }

    // console.log(sender_Private_KEY_Uint8)

    const sendKeyPair = solana.Keypair.fromSecretKey(sender_Private_KEY_Uint8);
    // console.log(sendKeyPair)

    const recipent_public_key = new solana.PublicKey(Recipient_PublicKey);

    // console.log(recipent_public_key)

    const transaction = new solana.Transaction().add(
        solana.SystemProgram.transfer({
            fromPubkey: sendKeyPair.publicKey,
            toPubkey: recipent_public_key,
            lamports: amount* solana.LAMPORTS_PER_SOL
        })
    )

    // let signature = await sendAndConfirmTransaction(
    //     connection_sol,
    //     transaction,
    //     [sendKeyPair]
    // );

    let signature = await solana.sendAndConfirmTransaction(
        connection_sol,
        transaction,
        [sendKeyPair]
    )

    console.log('transaction signature: '+signature)

}

// sendTransaction_SOL("0f1efd266e36095eee9e39619112db72dc262cf219c76aaae82e0eb20de9c941ad01d4fb64379ceffa1da419d3ef6e0d8845f06444f6983bb88be1f5579a111a")
// sendTransaction_SOL("w1QGpey5jxCC1czNDUqQmH6e2nsdHCzydUuVorpDMemiA8EP73Hqi3ncTZ6Wk44w7emChHfaKZHkspcGcfHL6Dh", "77VsMw1E7sdxuwHAjdjsyeUhJXXFFvVax1FNj7KqGGXR", 0.01)

