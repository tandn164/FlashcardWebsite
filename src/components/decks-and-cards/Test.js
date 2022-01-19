/**
 * Handles logic for getting the selected deck and cards.
 * Generates FlippableCards for each card to be shown, and 
 * renders them in a Carousel.
 */

 import React, { useState, useEffect } from 'react';
 import firebase from 'firebase';
 
 import { useHistory, useParams } from 'react-router-dom';
 
 import Spinner from '../Spinner';
 
 const shuffleCard = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

 const Test = () => {
   const history = useHistory();
   const [cards, setCards] = useState([]);
   const [hashCards, setHashCards] = useState(null);
   const [isCardFlipped, setIsCardFlipped] = useState(false);
   const [canView, setCanView] = useState(true);
   const [isLoaded, setIsLoaded] = useState(false);
   const { hash } = useParams();
   const [correctAnswer, setCorrectAnswer] = useState([]);
   const [selectedAnswer, setSelectedAnswer] = useState([]);
   const [result, setResult] = useState();
   const [submitted, setSubmitted] = useState(false);
 
   useEffect(() => {
     setIsLoaded(false);
     setHashCards(null);
     setCards(null);
 
     console.log(hash)
     if (hash === undefined) return;
 
     const db = firebase.firestore();
 
     db.collection('decks').doc(hash).get()
     .then(snapshot => {
       setIsLoaded(true);
     })
     .catch(error => {
       setIsLoaded(true);
       console.log("Error: ", error.message)
     })
 
     let ref = db.collection('decks').doc(hash);
     ref.get()
       .then(snapshot => {
         let arr = [];
         snapshot.data().cards?.forEach(item => arr.push(item));
         setHashCards(arr);
       })
       .catch(error => console.log("Error: ", error.message))
   }, [hash]);
 
   useEffect(() => {
     setIsLoaded(false);
     let _cards = [];
 
     if (hashCards != null) {
       _cards = hashCards;
     } else {
       _cards = [];
     }
 
     let _listCorrectAnswer = [];
     if (_cards.length > 0) {
       setCards(_cards.map((ele, cardIndex) => {
        const question = ele.front
        let answers = [];
        answers.push(ele.back);
        while (answers.length < 4) {
            const randomIndex = Math.floor(Math.random() * _cards.length);
            if (!answers.includes(_cards[randomIndex].back)) {
                answers.push(_cards[randomIndex].back)
            }
        }
        shuffleCard(answers);
        for (let index = 0; index < answers.length; index++) {
            const element = answers[index];
            if (element == ele.back) {
                _listCorrectAnswer.push(index)
            }
        }
        return {
            question: question,
            answers: answers,
        }
       }));
       setCorrectAnswer(_listCorrectAnswer);
       setSelectedAnswer(Array(_listCorrectAnswer.length).fill(-1))
       setIsLoaded(true);
     }

     }, [isCardFlipped, hashCards]
   );
 
   if (!isLoaded) return (
     <main>
       <div className="container center">
         <Spinner />
       </div>
     </main>
   );
 
   if (!cards) return (
     <div className="container center">
       <p>We couldn't find this deck. :(</p>
     </div>
   )
 
   if (!canView || cards.length === 0) return (
       <div className="container center">
         <p>This deck is either private or has no cards! If you are the owner, you can view it and edit it from your dashboard.</p>
       </div>
   );

   const _generateListQuestion = () => {
       return cards.map((ele, cardIndex) => {
         return (
            <div style={{
                border: '1px solid rgba(0, 0, 0, 0.5)', 
                borderRadius: 20,
                width: '100%',
                marginBottom: 30,
                padding: 30}}>
                    <div style={{
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        {ele?.question}
                    </div>
                {ele?.answers?.map((element, index)=> {
                  let backgroundColor = index == selectedAnswer[cardIndex] ? 'green' : 'white'
                  if (submitted) {
                    if (selectedAnswer[cardIndex] != correctAnswer[cardIndex] && index == correctAnswer[cardIndex]) {
                      backgroundColor = 'red'
                    }
                  }
                    return <div style={{
                        height: 30,
                        width: '80%',
                        marginLeft: '10%',
                        marginBottom: 10,
                        marginTop: 10,
                        border: '1px solid rgba(0, 0, 0, 0.2)', 
                        borderRadius: 20,
                        textAlign: 'center',
                        lineHeight: 2,
                        verticalAlign: 'center',
                        backgroundColor: backgroundColor,
                    }} onClick={(event) => {
                     const newAnswer = [
                         ...selectedAnswer.slice(0, cardIndex),
                         index, 
                         ...selectedAnswer.slice(cardIndex + 1)
                       ]
                     setSelectedAnswer(newAnswer)
                    }}>
                        <div style={{color: index == selectedAnswer[cardIndex] ? 'white' : 'black',}}>
                            {element}
                        </div>
                    </div>
                })}
            </div>
         )
       })
   }

   return (

    <div>
      <div 
        style={{
            borderRadius: '10px', 
            backgroundColor: 'gray', 
            color: 'white', 
            width: '100px',
            padding: '4px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '4px'
        }} 
        onClick={() => {
        history.push('/app/d/'+hash)
        }}
      >
        戻る
      </div>
        {result != null && <div style={{
            fontSize: 50,
            marginBottom: 30,

        }}>{`結果: ${result}/${cards.length}`}</div>}
        {_generateListQuestion()}
        <div style={{
            height: 50,
            width: '80%',
            marginLeft: '10%',
            backgroundColor: '#526CC6',
            color: 'white',
            fontSize: 26,
            textAlign: 'center',
            lineHeight: 2,
            verticalAlign: 'center',
            borderRadius: 25,
            cursor: 'pointer'
        }} onClick={(event) => {
            let totalResult = 0
            for (let index = 0; index < selectedAnswer.length; index++) {
                const selected = selectedAnswer[index];
                const correct = correctAnswer[index];
                if (selected == correct) {
                    totalResult += 1;
                }
            }
            setSubmitted(true);
            setResult(totalResult);
            window.scrollTo(0, 0);
        }}>回答を送信する</div>
    </div>
   );
 }
 
 export default Test;