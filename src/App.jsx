import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import CreateWallet from './components/CreateWallet';
import Account_Details from './components/Account_Details';

function App() {
  const [blockChain, setBlockChain] = useState();

  const [mnemonics, setMnemonics] = useState();

  const [walletAddress, setWalletAddress] = useState();

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home setBlockChain={setBlockChain}/>}/>
        {/* <Route path='/create' element={<CreateWallet setMnemonics={setMnemonics}/>}/> */}
        {/* <Route path='/account' element={<Account_Details blockChain={blockChain} mnemonics={mnemonics} walletAddress={walletAddress} setWalletAddress={setWalletAddress}/>}/> */}
      </Routes>
    </Router>
    </>
  )
}

export default App
