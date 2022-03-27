import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { usePositionalValues } from '../hooks/usePositionalValue';
import { Heat, heatsToBeatsBoard } from '../logics/apps/beat';
import { Feeling } from '../logics/apps/feeling';
import { calculateBarCount, createMusicStructure } from '../logics/apps/music';
import { createSection } from '../logics/apps/part';
import { TonePlayer } from '../logics/backend/tone';
import { Melody, Part, Sound } from '../logics/core/melody';
import { AccompanimentSectionCreator } from '../logics/core/section';
import { MusicRange } from '../components/MusicRange';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { HeatSlider } from '../components/HeatSlider';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { Grid } from '@material-ui/core';
import { InformationStep } from '../components/steps/information';

const IndexPage = () => {
  const player = useRef(new TonePlayer());
  const [bpm, setBpm] = useState(120);
  const [pulses, setPulses] = useState(4);
  const [measured, setMeasured] = useState(4);
  const [timeSecond, setTimeSecond] = useState(40);
  const [barCount, setBarCount] = useState(0);
  const [feelings, newFeelings, editFeelings, deleteFeelings] =
    usePositionalValues<Feeling>([
      {
        value: 'chreeful',
        position: 0,
      },
    ]);
  const [heats, newHeats, editHeats, deleteHeats] = usePositionalValues<Heat>([
    {
      value: 0,
      position: 0,
    },
  ]);

  useEffect(() => {
    const count = calculateBarCount(bpm, [pulses, measured], timeSecond);
    setBarCount(Math.floor(count));
  }, [bpm, pulses, measured, timeSecond]);

  async function createMusic() {
    const structure = createMusicStructure(
      bpm,
      [pulses, measured],
      timeSecond,
      new Sound(4, 0),
      feelings
    );

    const section = createSection(
      AccompanimentSectionCreator,
      0,
      structure.chordProgression.length,
      heatsToBeatsBoard(heats),
      structure
    );

    const part: Part = {
      synth: 'piano',
      bars: section,
      position: 0,
    };

    const melody: Melody = {
      parts: [part],
      structure: structure,
    };

    player.current.stop();

    await player.current.load(melody);
    await player.current.play();
  }

  return (
    <>
      <Layout title="Music Maker">
        <h2>BPM:</h2>
        <p>
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          ></input>
        </p>
        <h2>Time Signature:</h2>
        <p>
          <input
            type="number"
            value={pulses}
            onChange={(e) => setPulses(Number(e.target.value))}
          ></input>
          /
          <input
            type="number"
            value={measured}
            onChange={(e) => setMeasured(Number(e.target.value))}
          ></input>
        </p>
        <h2>Time Seconds:</h2>
        <p>
          <input
            type="number"
            value={timeSecond}
            onChange={(e) => setTimeSecond(Number(e.target.value))}
          ></input>
          s (Bar Count {barCount})
        </p>
        <h2>Feelings:</h2>
        <button onClick={newFeelings}>Join</button>
        <ul>
          {feelings.map((feeling, index) => (
            <li key={index}>
              position:
              {index == 0 && 0}
              {index != 0 && (
                <input
                  type="number"
                  value={feeling.position}
                  onChange={(e) =>
                    editFeelings(index, {
                      ...feeling,
                      position: Number(e.target.value),
                    })
                  }
                ></input>
              )}
              value:
              <select
                value={feeling.value}
                onChange={(e) =>
                  editFeelings(index, {
                    ...feeling,
                    value: e.target.value as Feeling,
                  })
                }
              >
                <option>chreeful</option>
                <option>dismal</option>
              </select>
              {index != 0 && (
                <button onClick={() => deleteFeelings(index)}>delete</button>
              )}
            </li>
          ))}
        </ul>

        <h2>Heats:</h2>
        <button onClick={newHeats}>Join</button>
        <ul>
          {heats.map((heat, index) => (
            <li key={index}>
              position:
              {index == 0 && 0}
              {index != 0 && (
                <input
                  type="number"
                  value={heat.position}
                  onChange={(e) =>
                    editHeats(index, {
                      ...heat,
                      position: Number(e.target.value),
                    })
                  }
                ></input>
              )}
              value:
              <input
                type="number"
                value={heat.value}
                onChange={(e) =>
                  editHeats(index, {
                    ...heat,
                    value: Number(e.target.value),
                  })
                }
              ></input>
              {index != 0 && (
                <button onClick={() => deleteHeats(index)}>delete</button>
              )}
            </li>
          ))}
        </ul>

        <hr></hr>
        <button onClick={createMusic}>play</button>
        <button onClick={player.current.stop}>stop</button>
        <div>
          <MusicRange avatar={<Avatar>H</Avatar>}>
            <div
              style={{
                width: 1000,
                height: 100,
                background: 'white',
              }}
            ></div>
          </MusicRange>
          <Divider />
          <MusicRange
            avatar={<Avatar>H</Avatar>}
            onChange={(value) => {
              editHeats(1, {
                ...heats[1],
                position: value.start * 4,
              });
            }}
          >
            <Grid
              container
              direction="row"
              alignContent="center"
              alignItems="center"
            >
              <HeatSlider
                onChange={(value) => {
                  editHeats(1, {
                    ...heats[1],
                    value: value,
                  });
                }}
              />
            </Grid>
          </MusicRange>
          <Divider />
          <MusicRange avatar={<Avatar>H</Avatar>}>test</MusicRange>
        </div>
        <InformationStep
          onChangeBpm={(bpm) => {
            console.log('bpm:', bpm);
          }}
          onChangeTimeSignature={(timeSig) => {
            console.log('time signature:', timeSig);
          }}
          onChangeTimeSeconds={(seconds) => {
            console.log('time seconds:', seconds);
          }}
        />
      </Layout>
    </>
  );
};

export default IndexPage;
