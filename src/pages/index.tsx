import Layout from '../components/Layout'
import { heatsToBeatsBoard } from '../logics/apps/beat';
import { createMusicStructure } from '../logics/apps/music';
import { createSection } from '../logics/apps/part';
import { TonePlayer } from '../logics/backend/tone';
import {  Melody, Part, Sound } from '../logics/core/melody';
import { AccompanimentSectionCreator } from '../logics/core/section';

const IndexPage = () => {
  async function createMusic() {
     const structure = createMusicStructure(
      200,
      [4, 4],
      20,
      new Sound(4, 0),
      [{
       value: "chreeful",
       position: 0
      },
      {
        value: "dismal",
        position: 4
      },
      {
        value: "chreeful",
        position: 8
       },
       {
        value: "dismal",
        position: 12
       },
       {
        value: "chreeful",
        position: 16
       },
    ],
    );

    const section = createSection(
      AccompanimentSectionCreator,
      0,
      structure.chordProgression.length,
      heatsToBeatsBoard([{
        value: 1,
        position: 0
      }]),
      structure
    );

    const part : Part = {
      synth: "synth",
      bars: section,
      position: 0
    }

    const melody : Melody = {
      parts: [part],
      structure: structure
    }

    const player = new TonePlayer(melody);
    await player.load();
    await player.play();
  }

 return  (
 <>
 <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <button onClick={createMusic}>
      create 
    </button>
  </Layout>
  </>
  );
}

export default IndexPage
