import React, { useEffect, useState } from 'react'
import axios from 'axios';

const App = () => {
  
  const [questionNo , setQuestionNo] = useState(0)
  const [questionArr , setquestionArr] = useState ([])
  const [loading , setloading] = useState (false)
  const [optionsArr , setoptionsArr] = useState ([])
  const [resultPage  , setResultPage] = useState (false)

  useEffect (()=>{
    getData()
  }, [])

  function getData (){
    axios ('https://the-trivia-api.com/v2/questions')
    .then(res => {
      // console.log(res.data)
      setquestionArr (res.data)
      setloading (true)
      // console.log (questionArr[questionNo].incorrectAnswers)
      // setoptionsArr([...questionArr[questionNo].incorrectAnswers , questionArr[questionNo].correctAnswer])
    })
    .catch (err => console.log (err))
  }
  
  function NextQuestion () {
    if (questionNo < questionArr.length - 1){
      setQuestionNo (questionNo + 1)
    } else {
      setQuestionNo (questionNo)
      setloading(false)
      setResultPage (true)
    }
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
        
        {questionArr.length > 0 ? [...questionArr[questionNo].incorrectAnswers , questionArr[questionNo].correctAnswer].map ((items , index)=> {
          return <div key={index}>
          <input type="radio" id={`question-`+ index} name='question'/>
          <label htmlFor={`question-`+ index}>{items}</label><br />
          </div>
        }) : null}
        
        <div>
        <button onClick={NextQuestion}>NEXT</button>
        </div>
      
      </div> : resultPage ? <div>condition lagao bhi</div> : <div>Loading......</div>}
      
    </>
  )
}

export default App