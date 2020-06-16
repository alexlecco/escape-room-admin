import React, { Component } from 'react';
import './App.css';
import ReactCountdownClock from 'react-countdown-clock'
import firebase from './firestore'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 0,
      isPaused: false
    }

    this.room1Ref = firebase.firestore().collection('room1').doc('glYViwyAivdHSVtoljZN')
  }

  componentDidMount() {
    this.listenUpdater(this.room1Ref)
  }

  listenUpdater(ref) {
    ref.onSnapshot(function(doc) {
      const isPenalizedValue = doc.data().isPenalized
      const startValue = doc.data().start
      isPenalizedValue ? this.penalize() : startValue ? this.start() : this.reset()
    }.bind(this))
  }

  sendStart() { this.room1Ref.update({ 'start': true }) }
  
  sendReset() { this.room1Ref.update({ 'start': false, 'isPenalized': false, 'isPaused': false }) }
  
  sendPenalize() { this.room1Ref.update({ 'isPenalized': true }) } 

  sendPause() {
    const { isPaused } = this.state
    this.room1Ref.update({ 'isPaused': !isPaused })
    this.setState({ isPaused: !isPaused })
  }

  start() {this.setState({time: 3600})}
  reset() {this.setState({time: 0})}
  penalize() {this.setState({time: 300})}

  myCallback() { console.log('tiempo cumplido') } 

  render() {
    const { time, isPaused } = this.state
    const buttonStyle = {marginRight: 20, marginBottom: 20, width: 130, height: 50}
    const buttonStylePressed = {marginRight: 20, marginBottom: 20, width: 130, height: 50, color: '#fff', backgroundColor: '#2e2e2e'}
    const pauseButtonStyle = isPaused ? buttonStylePressed : buttonStyle
    const buttonsContainerStyle = {display: 'flex', flexDirection: 'column', marginTop: 20}
    const pauseText = isPaused ? 'quitar pausa' : 'pausar'
    const handleSendStart = () => this.sendStart()
    const handleSendPause = () => this.sendPause()
    const handleSendReset = () => this.sendReset()
    const handleSendPenalize = () => this.sendPenalize()

    return (
      <div className='App'>
        <header className='App-header'>
          <h1> Escape Room Tucumán </h1>
          <h2> ADMIN </h2>
          <p> tiempo restante: </p>
          <div style={{textAlign: 'left'}}>
            <ReactCountdownClock
              seconds={time}
              color='#427ef5'
              alpha={0.9}
              size={200}
              paused={isPaused}
              onComplete={() => this.myCallback()}
            />
          </div>
  
          <div style={buttonsContainerStyle}>
            <button style={buttonStyle} onClick={handleSendStart}> iniciar </button>
            <button style={pauseButtonStyle} onClick={handleSendPause}> {pauseText} </button>
            <button style={buttonStyle} onClick={handleSendReset}> reiniciar </button>
            <button style={buttonStyle} onClick={handleSendPenalize}> penalizar </button>
          </div>
        </header>
      </div>
    )
  }
}