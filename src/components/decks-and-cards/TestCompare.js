/**
 * Handles logic for getting the selected deck and cards.
 * Generates FlippableCards for each card to be shown, and 
 * renders them in a Carousel.
 */

import React, { useState, useEffect } from 'react';
import firebase from 'firebase';

import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import Spinner from '../Spinner';
import PageHeading from '../PageHeading';
import { useAlert } from 'react-alert';

const shuffleCard = (array) => {

    if (!array) {
        return []
    }
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const TestCompare = () => {
    const history = useHistory();

    const [hashCards, setHashCards] = useState([]);
    const [originCards, setOriginCards] = useState([]);
    const [randomCards, setRandomCards] = useState([]);
    const [canView, setCanView] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedIndex1, setSelectedIndex1] = useState(null);
    const [selectedIndex2, setSelectedIndex2] = useState(null);
    const { hash } = useParams();
    const alert = useAlert()

    useEffect(() => {
        setIsLoaded(false);
        setHashCards(null);

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
        setOriginCards(hashCards)
        let newArray = hashCards?.slice();
        setRandomCards(shuffleCard(newArray))
        setIsLoaded(true);
    }, [hashCards]);

    if (!isLoaded) return (
        <main>
            <div className="container center">
                <Spinner />
            </div>
        </main>
    );

    if (!hashCards) return (
        <div className="container center">
            {/* <p>We couldn't find this deck. :(</p> */}
            <p>ローディング...(</p>
        </div>
    )

    if (!canView || hashCards.length === 0) return (
        <div style={{display: 'flex', flexDirection: 'column', marginTop: '20vh'}}>
            <div style={{textAlign: 'center'}}>
                <p style={{fontSize: '30px'}}>テストが完了しました。 よくやった！</p>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div 
                    style={{
                        borderRadius: '10px', 
                        backgroundColor: 'gray', 
                        color: 'white', 
                        width: '100px',
                        padding: '4px',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }} 
                    onClick={() => {
                    history.push('/app/d/'+hash)
                    }}
                >
                    戻る
                </div>
            </div>
        </div>
    );

    const _onCheck = (index1, index2) => {
        if (originCards[index1].back != randomCards[index2].back) {
            setSelectedIndex1(null)
            setSelectedIndex2(null)
            alert.show('間違い!')
        } else {
            originCards.splice(index1, 1);
            randomCards.splice(index2, 1);
            setSelectedIndex1(null)
            setSelectedIndex2(null)
            alert.show('正しい!')
        }
    }

    const _generateListFront = () => {
        return originCards?.map((ele, index) => {
            return (
                <div style={{
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
                    backgroundColor: selectedIndex1 == index ? 'green' : 'white',
                }} onClick={(event) => {
                    if (selectedIndex1 == index) {
                        setSelectedIndex1(null)
                    } else {
                        setSelectedIndex1(index)
                        if (selectedIndex2 != null) {
                            _onCheck(index, selectedIndex2)
                        }
                    }
                }}>
                    <div style={{
                        width: '100%',
                        textAlign: 'center',
                        color: selectedIndex1 == index ? 'white' : 'black'
                    }}>
                        {ele?.front}
                    </div>
                </div>
            )
        })
    }

    const _generateListBack = () => {
        return randomCards?.map((ele, index) => {
            return (
                <div style={{
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
                    backgroundColor: selectedIndex2 == index ? 'green' : 'white',
                }} onClick={(event) => {
                    if (selectedIndex2 == index) {
                        setSelectedIndex2(null)
                    } else {
                        setSelectedIndex2(index)
                        if (selectedIndex1 != null) {
                            _onCheck(selectedIndex1, index)
                        }
                    }
                }}>
                    <div style={{
                        width: '100%',
                        textAlign: 'center',
                        color: selectedIndex2 == index ? 'white' : 'black'
                    }}>
                        {ele?.back}
                    </div>
                </div>
            )
        })
    }

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '50%', margin: '0 auto', paddingRight: 30 }}>
                <PageHeading
                    title="フロント"
                />
                <div style={{ padding: 20, background: '#B9BBEA', borderRadius: 10 }}>
                    <div>
                        {_generateListFront()}
                    </div>
                </div>
            </div>
            <div style={{ width: '50%', margin: '0 auto', paddingLeft: 30 }}>
                <PageHeading
                    title="バック"
                />
                <div style={{ padding: 20, background: '#B9BBEA', borderRadius: 10 }}>
                    <div>
                        {_generateListBack()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestCompare;
