import { makeStyles, Theme, createStyles } from '@material-ui/core';
import React from 'react';
import { usePositionalValues } from '../hooks/usePositionalValue';
import { Feeling } from '../logics/apps/feeling';
import { Rnd } from 'react-rnd';
import { PositionalOption } from '../logics/core/melody';

type FcProps = {
  lineWidth: number;
};

type CssProps = {
  lineWidth: number;
};

const useStyles = makeStyles<Theme, CssProps>((theme) => createStyles({}));

export const FeelingSlider: React.FC<FcProps> = (props) => {
  const grid = 50;
  const [feelings, newFeelings, editFeelings, deleteFeelings] =
    usePositionalValues<Feeling>([
      {
        value: 'chreeful',
        position: 0,
      },
    ]);
  return (
    <div>
      <button onClick={newFeelings}>add</button>
      {feelings.map((curr, idx) => {
        const next: PositionalOption<Feeling> = feelings[idx + 1];
        const prevPos = feelings[idx - 1]?.position || 0;
        const currPos = next ? curr.position : props.lineWidth;

        return (
          <>
            <div
              style={{
                left: prevPos,
                right: props.lineWidth - currPos,
                height: '100%',
                background: 'green',
              }}
            ></div>
            {next && (
              <Rnd
                default={{
                  x: currPos,
                  y: 0,
                  width: 24,
                  height: '100%',
                }}
                dragAxis="x"
                enableResizing={false}
                dragGrid={[grid, 0]}
                bounds="parent"
                onDrag={(_, data) => {
                  editFeelings(idx, {
                    ...curr,
                    position: data.x,
                  });
                }}
              ></Rnd>
            )}
          </>
        );
      })}
    </div>
  );
};
