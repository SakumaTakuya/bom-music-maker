import { useState } from 'react';
import Layout from '../components/Layout';
import { heatsToBeatsBoard } from '../logics/apps/beat';
import { Feeling, Feelings } from '../logics/apps/feeling';
import { createMusicStructure } from '../logics/apps/music';
import { createSection } from '../logics/apps/part';
import { TonePlayer } from '../logics/backend/tone';
import { Melody, Part, PositionalOption, Sound } from '../logics/core/melody';
import { AccompanimentSectionCreator } from '../logics/core/section';

const IndexPage = () => {
  const [bpm, setBpm] = useState(120);
  const [pulses, setPulses] = useState(4);
  const [measured, setMeasured] = useState(4);
  const [timeSecond, setTimeSecond] = useState(40);
  const [feelings, setFeelings] = useState<Feelings>([
    {
      value: 'chreeful',
      position: 0,
    },
  ]);

  const newFeelings = () => {
    const last = feelings[feelings.length - 1];
    setFeelings([
      ...feelings,
      {
        value: last.value,
        position: last.position + 1,
      },
    ]);
  };

  const editFeelings = (id: number, feeling: PositionalOption<Feeling>) => {
    const copied = [...feelings];
    copied[id] = feeling;
    setFeelings([...copied]);
    console.log(feelings);
  };

  const deleteFeelings = (id: number) => {
    setFeelings(feelings.filter((_, i) => i !== id));
  };

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
      heatsToBeatsBoard([
        {
          value: 1,
          position: 0,
        },
      ]),
      structure
    );

    const part: Part = {
      synth: 'synth',
      bars: section,
      position: 0,
    };

    const melody: Melody = {
      parts: [part],
      structure: structure,
    };

    const player = new TonePlayer(melody);
    await player.load();
    await player.play();
  }

  return (
    <>
      <Layout title="Music Maker">
        <h1>Bom Music Maker</h1>
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
          pulses
          <input
            type="number"
            value={pulses}
            onChange={(e) => setPulses(Number(e.target.value))}
          ></input>
          measured
          <input
            type="number"
            value={measured}
            onChange={(e) => setMeasured(Number(e.target.value))}
          ></input>
        </p>
        <h2>Time Seconds</h2>
        <p>
          <input
            type="number"
            value={timeSecond}
            onChange={(e) => setTimeSecond(Number(e.target.value))}
          ></input>
        </p>
        <h2>Feelings:</h2>

        <button onClick={newFeelings}>Join</button>
        <ul>
          {feelings.map((feeling, index) => (
            <li key={index}>
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

        <button onClick={createMusic}>create</button>
      </Layout>
    </>
  );
};

export default IndexPage;
