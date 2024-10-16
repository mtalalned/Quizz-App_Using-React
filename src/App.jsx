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
  
  return (
    <>
    {loading ? <div>
        
        <div>
        <h2>Question No. {questionNo + 1}</h2>
        </div>
        
        <div>
        <p>{questionArr[questionNo].question.text}</p>
        </div>
        
        {questionArr.length > 0 ? randomOptions.map ((items , index)=> {
          return <div key={index}>
          <input type="radio" id={`question-`+ index} name='question' value={items} onChange={el => radioButtonValue(el)} checked={selectedOption === items} disabled={radioDisabled}/>
          <label htmlFor={`question-`+ index}>{items}</label><br />
          </div>
        }) : null}
        
        <div>
        <button onClick={NextQuestion}>NEXT</button>
        </div>
        
      </div> : resultPage ? 
      
      <div>
      
      <div>
      {optionArr.map ((items , index) => {
        return <div className='flex'>
          <p>Question No. {index + 1}</p>
          <p>Selected Option: {items}</p>
          <p>Correct Option: {questionArr[index].correctAnswer}</p>
          <p>Obtained Marks: {numbersArr[index]}</p>
        </div>
      })}
      </div>
      
      <div>
        <p>Total Obtained Marks: {numbersArr.reduce((accumulator , currentValue)=> {
          return accumulator + currentValue
        }, 0)}</p>
      </div>
      
      </div>
      
       : <div>Loading......</div>}
      
      {toastControl ? <div>Please Select an Option <button onClick={ToastControl}>ok</button></div> : null}
    </>
  )
}

export default App