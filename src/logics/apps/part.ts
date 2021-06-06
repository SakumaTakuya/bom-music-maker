import { LeaderBoard, selectBeats } from '../core/beat';
import { Bar, Beat, MelodyStructure, PositionalOption } from '../core/melody';
import { SectionCreator } from '../core/section';

export function createSection(
  creatorClass: new (
    beats: Beat[],
    structure: MelodyStructure
  ) => SectionCreator,
  startPosition: number,
  count: number,
  leaderBoards: PositionalOption<LeaderBoard>[],
  melodyStructure: MelodyStructure
): Bar[] {
  const createUnit = 8;
  const halfUnit = createUnit / 2;
  const result: Bar[] = [];
  for (startPosition = 0; startPosition < count; ) {
    const leaderBoard = leaderBoards.current(startPosition).value;
    const beats = selectBeats(melodyStructure.timeSigneture, leaderBoard);

    const sectionCreator = new creatorClass(beats, melodyStructure);

    if (leaderBoards.current(startPosition).value != leaderBoard) {
      result.push(...sectionCreator.create(startPosition, halfUnit));
      startPosition += halfUnit;
    } else {
      result.push(
        ...sectionCreator.create(startPosition, halfUnit),
        ...sectionCreator.create(startPosition + halfUnit, halfUnit)
      );
      startPosition += createUnit;
    }
  }

  return result;
}
