import React, { useEffect, useState } from 'react'
import axios from 'axios';

const App = () => {
  
  const [questionNo , setQuestionNo] = useState(0)
  const [questionArr , setquestionArr] = useState ([])
  const [loading , setloading] = useState (false)
  const [resultPage  , setResultPage] = useState (false)
  const [radioCheck , setRadioCheck] = useState(true)
  const [optionArr , setoptionsArr] = useState([])  
  const [selectedOption, setSelectedOption] = useState(null);
  const [radioDisabled, setRadioDisabled] = useState(false);
  const [numbersArr , setNumbersArr] = useState ([])
  const [randomOptions, setrandomOptions] = useState ([])
  const [nextControl , setNextControl] = useState(false)
  const [toastControl , setToastControl] = useState (false)
  const [blurScreen , setBlurScreen] = useState(false)
  
  useEffect (()=>{
    getData()
  }, [])

  useEffect (()=>{
    if (questionArr.length > 0) {
      const shuffledOptions = shuffleArray([...questionArr[questionNo].incorrectAnswers , questionArr[questionNo].correctAnswer])
      setrandomOptions(shuffledOptions)
    }
  }, [questionNo , questionArr])

  function getData (){
    axios ('https://the-trivia-api.com/v2/questions')
    .then(res => {
      console.log(res.data)
      setquestionArr (res.data)
      setloading (true)
    })
    .catch (err => console.log (err))
  }
  
  function NextQuestion () {
    
    if (nextControl) {
      if (questionNo < questionArr.length - 1){
        setQuestionNo (questionNo + 1)
        setRadioCheck (true)
        setSelectedOption(null)
        setRadioDisabled(false)
        setNextControl (false)
      } else {
        setQuestionNo (questionNo)
        setloading(false)
        setResultPage (true)
        const numberCheckArr = []
        for (var i = 0; i < optionArr.length; i++){
            if (optionArr[i] === questionArr[i].correctAnswer){
                numberCheckArr.push (10)
            } else {
                numberCheckArr.push (0)
            }
            setNumbersArr(numberCheckArr)
      }}
    } else {
      setToastControl (true)
      setBlurScreen (true)
    }
  }
  
  function radioButtonValue (el) {
    if (radioCheck) {
      setoptionsArr([...optionArr , el.target.value])
      setSelectedOption(el.target.value)
      setRadioCheck (false)
      setRadioDisabled(true)
      setNextControl (true)
    }
  }
  
  function ToastControl () {
    setToastControl (false)
    setBlurScreen (false)
  }

  function shuffleArray (arr) {
    const randomNumberArray = []
    const shuffledArray = []
    for (var i = 0; i < arr.length; i++){
        const randomNumber = Math.floor (Math.random()*arr.length)
        if (randomNumberArray.includes(randomNumber)) {
            i--
        } else {
            randomNumberArray.push (randomNumber)
            shuffledArray[randomNumber] = arr[i]
        }
    }
    
    return shuffledArray
  }

  const PlayAgain = ()=>{
    window.location.reload()
  }
  
  return (
    <>
    {loading ? <div className={`flex flex-col gap-y-5 p-5 bg-[#ffffff] border-[2px] border-indigo-700 shadow-[0_0px_20px_5px_#ffffff] rounded-xl ${blurScreen ? 'blur' : null}`}>
        <div>
          <h1 className='p-1 text-center bg-[#0f469a] text-white rounded-md text-3xl shadow-md font-bold'>QUIZZ APP</h1>
        </div>

        <div className='flex flex-col gap-y-3 border shadow-md rounded-md p-4'>
        
        <div className='flex flex-col gap-y-1'>
        <h2 className='text-2xl font-bold text-[#0f469a]'>Question No. {questionNo + 1}</h2>
        <p className='text-xl'>{questionArr[questionNo].question.text}</p>
        </div>
  
        {questionArr.length > 0 ? randomOptions.map ((items , index)=> {
          return <div key={index} className='flex gap-x-2'>
          <input type="radio" id={`question-`+ index} name='question' value={items} onChange={el => radioButtonValue(el)} checked={selectedOption === items} disabled={radioDisabled}/>
          <label className='text-[1.15rem] text-gray-600' htmlFor={`question-`+ index}>{items}</label><br />
          </div>
        }) : null}
        </div>
               
        <div className='text-end'>
        <button className='px-7 py-1 text-white text-xl border rounded-md bg-[#0f469a] shadow-md' onClick={NextQuestion}>NEXT</button>
        </div>
        
      </div> : resultPage ? 
      
      <div>
      
      <div className='flex flex-col gap-y-5 p-5 bg-[#ffffff] border-[2px] border-indigo-700 shadow-[0_0px_20px_5px_#ffffff] rounded-xl'>
      
        <div>
          <h1 className='p-1 text-center bg-[#0f469a] text-white rounded-md text-3xl shadow-md font-bold'>RESULTS</h1>
        </div>
      
        <div className='overflow-auto flex flex-col gap-y-4 p-5 border-gray-900 shadow-[0_0px_15px_1px_#e1e1e1] h-[300px] rounded-md'>
        {optionArr.map ((items , index) => {
        return <div key={index} className='flex flex-wrap justify-center items-start gap-x-5 gap-y-2 border-gray-900 rounded-md shadow-[0_0px_5px_2px_#e1e1e1]'>
          <div className='basis-[100%] min-[414px]:basis-[40%] min-[800px]:basis-[20%] min-w-[135px] flex flex-col gap-y-1'>
          <p className='text-center bg-[#6a95d7] text-white rounded-md py-1'>Question No</p>
          <p className='text-center'>{index + 1}</p>
          </div>
          <div className='basis-[100%] min-[414px]:basis-[40%] min-[800px]:basis-[20%] min-w-[135px] flex flex-col gap-y-1'>
          <p className='text-center bg-[#6a95d7] text-white rounded-md py-1'>Selected Option</p>
          <p className='text-center'>{items}</p>
          </div>
          <div className='basis-[100%] min-[414px]:basis-[40%] min-[800px]:basis-[20%] min-w-[135px] flex flex-col gap-y-1'>
            <p className='text-center bg-[#6a95d7] text-white rounded-md py-1'>Correct Option</p>
            <p className='text-center'>{questionArr[index].correctAnswer}</p>
          </div>
          <div className='basis-[100%] min-[414px]:basis-[40%] min-[800px]:basis-[20%] min-w-[135px] flex flex-col gap-y-1'>
          <p className='text-center bg-[#6a95d7] text-white rounded-md py-1'>Score</p>
          <p className='text-center'>{numbersArr[index]}</p>
          </div>
        </div>
        })}
        </div>
      
        <div>
          <p className='p-1 text-center bg-[#0f469a] text-white rounded-md text-3xl shadow-md font-bold'>Total Obtained Marks: {numbersArr.reduce((accumulator , currentValue)=> {
            return accumulator + currentValue
          }, 0)} / 100</p>
        </div>

        <div className='text-end'>
        <button className='px-7 py-1 text-white text-xl border rounded-md bg-[#0f469a] shadow-md' onClick={PlayAgain}>PLAY AGAIN</button>
        </div>
      </div>
      
      </div>
       
       : <div className='max-h-screen flex justify-center p-5 bg-[#ffffff] border-[2px] border-indigo-700 shadow-[0_0px_20px_5px_#ffffff] rounded-xl text-3xl text-[#0f469a]'>Loading......</div> }
      
      {toastControl ? 
      <div className='absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center'>
        <div className='sm:w-[40%] gap-y-5 p-5 bg-[#ffffff] border-[1px] border-indigo-700 shadow-[0_0px_20px_5px_#ffffff] rounded-xl'>
        <p className='text-xl pb-3'>Please select an option !</p> 
        <div className='text-end'>
        <button className='px-6 py-1 text-white text-xl border rounded-md bg-[#0f469a] shadow-md' onClick={ToastControl}>OK</button>
        </div>
        </div>
      </div>
       : null}

    </>
  )
}

export default App