import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateWallet = ({setMnemonics}) => {
    const mnemonics = ["brush", "window", "render", "eternal", "price", "real", "like", "double", "tornado", "exhibit", "magnet", "ordinary"];
    const [secret, setSecret] = useState("...")
    const [wordCount, setWordCount] = useState(0);

    const navigate = useNavigate()

    const onMnemonicsChange = (e, word)=>{
        if(wordCount>=12){
            alert("12 words done")
            return;
        }
        if(secret=="..."){
            setSecret(word)
        }else{
            setSecret(secret + " "+ word)
        }
        setWordCount(wordCount+1)
    }

    const CopyToClipBoard = (e)=>{
        e.preventDefault()
        if(wordCount<12){
            alert("12 words needed")
        }else{
            navigator.clipboard.writeText(secret).then(
                ()=>{
                    alert('Text copied to clipboard')
                },
                (err)=>{
                    console.log("failed to copy "+ err)
                }
            )
        }
    }

    const CreateAccount = ()=>{
        setMnemonics(secret)
        if(wordCount==12){
            alert("Make sure to save ur secret phrase")
            navigate("/account")
        }else{
            alert("compelete the secret phrase first")
        }
    }

  return (
    <div className="grid grid-cols-12 grid-rows-6">
  <div className="col-span-8 ml-9 flex flex-col gap-6" style={{ gridRow: '2 / span 4' }}>
    <div className='flex flex-col items-center gap-3'>
        <h1 className="text-2xl font-bold">Choose your mnemonics</h1>

        <div className="grid grid-cols-4 grid-rows-3 gap-6">
            {mnemonics.map((word, index) => (
                <button key={index} className="bg-gray-200 p-2 text-xl rounded" onClick={e=>onMnemonicsChange(e, word)}>
                {word}
                </button>
            ))}
        </div>
    </div>

    <div className='flex flex-col gap-2'>
        <h1 className="text-2xl font-bold flex"> Your Secret Phrase: &nbsp; <button onClick={e=>CopyToClipBoard(e)}>Copy</button> <span className='ml-auto'>wordCount: {wordCount}</span> </h1>
        <h1 className='bg-white text-2xl'>{secret}</h1>
    </div>

    <div className='flex justify-center'>
        <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg border-2 border-black shadow-lg flex items-center justify-center hover:bg-red-700 active:bg-red-800 transition-colors duration-300" onClick={(e)=>CreateAccount(e)}>
            <span className="mr-2">💥</span> Create Account
        </button>
    </div>

  </div>
</div>



  )
}

export default CreateWallet
