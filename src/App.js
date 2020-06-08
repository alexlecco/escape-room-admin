import React, { Component } from 'react';
import './App.css';
import ReactCountdownClock from 'react-countdown-clock'
import firebase from './firestore'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { time: 0 }

    this.room1Ref = firebase.firestore().collection('room1').doc('glYViwyAivdHSVtoljZN')
    const room1ref = this.room1Ref
  }

  componentDidMount() {
    this.listenUpdater(this.room1Ref)
  }

  listenUpdater(ref) {
    ref.onSnapshot(function(doc) {
      const penalizeValue = doc.data().penalization
      const startValue = doc.data().start
      penalizeValue ? this.penalize() : startValue ? this.start() : this.reset()
    }.bind(this))
  }

  sendStart() {
    const ref = firebase.firestore().collection('room1').doc('glYViwyAivdHSVtoljZN')
    ref.update({ "start": true, "penalization": false })
  }

  sendReset() {
    const ref = firebase.firestore().collection('room1').doc('glYViwyAivdHSVtoljZN')
    ref.update({ "start": false, "penalization": false })
  }

  sendPenalize() {
    const ref = firebase.firestore().collection('room1').doc('glYViwyAivdHSVtoljZN')
    ref.update({ "penalization": true, "start": false })
  } 

  start() {this.setState({time: 3600})}
  reset() {this.setState({time: 0})}
  penalize() {this.setState({time: 300})}

  myCallback() { console.log("tiempo cumplido") } 

  render() {
    const { time } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1> Escape Room Tucumán </h1>
          <h2> ADMIN </h2>
          <p> tiempo restante: </p>
          <div style={{textAlign: 'left'}}>
            <ReactCountdownClock
              seconds={time}
              color="#ff004c"
              alpha={0.9}
              size={200}
              onComplete={() => this.myCallback()}
            />
          </div>
  
          <div style={{display: 'flex', flexDirection: 'column', marginTop: 20}}>
            <button style={{marginRight: 20, width: 130, height: 50}} onClick={() => this.sendStart()}> iniciar </button>
            <button style={{marginRight: 20, width: 130, height: 50}} onClick={() => this.sendReset()}> reiniciar </button>
            <button style={{marginRight: 20, width: 130, height: 50}} onClick={() => this.sendPenalize()}> penalizar </button>
          </div>
        </header>
      </div>
    )
  }
}