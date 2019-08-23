import * as React from 'react'
import * as PropTypes from 'prop-types'

import MusicalKeyboard from 'react-musical-keyboard'

import getKeyFrequency from './services/getKeyFrequency'

const PITCH_NAMES = 'C C# D D# E F F# G G# A A# B'.split(' ')

const App = ({
  startKey: startKeyProp = 21,
  endKey: endKeyProp = 108,
  sound: soundProp = 0,
  sounds = [],
  generator = null,
  keyboardMapping = {},
}) => {
  const [withLabels, setWithLabels, ] = React.useState(false)
  const [sound, setSound, ] = React.useState(soundProp)
  const [sustain, setSustain, ] = React.useState(false)
  const [sostenuto, setSostenuto, ] = React.useState(false)
  const [unaCorda, setUnaCorda, ] = React.useState(false)

  const soundRef = React.useRef(null)
  const sustainPedalRef = React.useRef(null)
  const sostenutoPedalRef = React.useRef(null)
  const unaCordaPedalRef = React.useRef(null)
  const keyboardRef = React.useRef(null)

  const keepFocus = () => {
    window.setTimeout(() => {
      keyboardRef.current.focus()
    })
  }

  const handleSoundChange = e => {
    setSound(e.target.value)
    keepFocus()
  }

  const handleSustainPedalDepress = () => {
    setSustain(127)
    keepFocus()
  }

  const handleSustainPedalRelease = () => {
    setSustain(0)
    keepFocus()
  }

  const handleSostenutoPedalDepress = () => {
    setSostenuto(127)
    keepFocus()
  }

  const handleSostenutoPedalRelease = () => {
    setSostenuto(0)
    keepFocus()
  }

  const handleUnaCordaPedalDepress = () => {
    setUnaCorda(127)
    keepFocus()
  }

  const handleUnaCordaPedalRelease = () => {
    setUnaCorda(0)
    keepFocus()
  }

  const handleKeyOn = e => {
    generator.soundOn(
      e.target.value.id,
      e.target.value.velocity * 0x7f,
      getKeyFrequency(e.target.value.id, 69, 440),
    )
  }

  const handleKeyOff = e => {
    generator.soundOff(e.target.value.id)
  }

  React.useEffect(() => {
    generator.sendMessage(64, sustain)
  }, [sustain, ])

  React.useEffect(() => {
    generator.sendMessage(66, sostenuto)
  }, [sostenuto, ])

  React.useEffect(() => {
    generator.sendMessage(67, unaCorda)
  }, [unaCorda, ])

  React.useEffect(() => {
    generator.changeSound(sound)
    soundRef.current.value = sound
  }, [sound, ])

  React.useEffect(() => {
    window.document.body.addEventListener('focus', keepFocus)
    return () => {
      window.document.body.removeEventListener('focus', keepFocus)
    }
  }, [])

  return (
    <React.Fragment>
      <div
        className="topbar"
      >
        <label className="sound">
          <span className="label">Sound</span>
          <select
            className="input"
            name="sound"
            onChange={handleSoundChange}
            ref={soundRef}
          >
            {
              sounds.map((s, i) => (
                <option
                  key={i}
                  value={i}
                >
                  {s}
                </option>
              ))
            }
          </select>
        </label>
      </div>
      <div
        style={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
          left: 0,
          borderColor: 'black',
        }}
      >
        <div
          className="pedals"
        >
          <button
            type="button"
            ref={unaCordaPedalRef}
            onMouseDown={handleUnaCordaPedalDepress}
            onMouseUp={handleUnaCordaPedalRelease}
          >
            Una Corda
          </button>
          <button
            type="button"
            ref={sostenutoPedalRef}
            onMouseDown={handleSostenutoPedalDepress}
            onMouseUp={handleSostenutoPedalRelease}
          >
            Sostenuto
          </button>
          <button
            type="button"
            ref={sustainPedalRef}
            onMouseDown={handleSustainPedalDepress}
            onMouseUp={handleSustainPedalRelease}
          >
            Sustain
          </button>
        </div>
        <div
          className="keyboard"
        >
          <MusicalKeyboard
            ref={keyboardRef}
            labels={key => withLabels ? `${PITCH_NAMES[key.id % 12]}${Math.floor(key.id / 12) - 1}` : null}
            onKeyOn={handleKeyOn}
            onKeyOff={handleKeyOff}
            startKey={startKeyProp}
            endKey={endKeyProp}
            accidentalKeyHeight="65%"
            keyboardMapping={keyboardMapping}
            naturalKeyColor="white"
            accidentalKeyColor="black"
          />
        </div>
      </div>
    </React.Fragment>
  )
}

App.propTypes = {
  startKey: PropTypes.number,
  endKey: PropTypes.number,
  sound: PropTypes.number,
  sounds: PropTypes.arrayOf(PropTypes.number),
  generator: PropTypes.object,
  keyboardMapping: PropTypes.object,
}

export default App