import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { useState } from 'react';
import VerticalInput from './commons/VerticalInput';
import '../utils/number';
import { lerpColor } from '../utils/number';
import { decomposeColor, recomposeColor } from '@material-ui/core';
import React from 'react';

type FcProps = {
  min?: number;
  max?: number;
  onChange?(value: number): void;
};

type CssProps = {
  rate: number;
};

const useStyles = makeStyles<Theme, CssProps>((theme) =>
  createStyles({
    background: {
      display: 'flex',
      alignItems: 'center',
      background: (props) => {
        const to1 = decomposeColor(theme.palette.error.light);
        const to2 = decomposeColor(theme.palette.info.light);
        const from1 = decomposeColor(theme.palette.error.main);
        const from2 = decomposeColor(theme.palette.info.main);

        const toColor = {
          ...to1,
          values: lerpColor(to1.values, to2.values, props.rate),
        };

        const fromColor = {
          ...from1,
          values: lerpColor(from1.values, from2.values, props.rate),
        };

        return `linear-gradient(${recomposeColor(toColor)} , ${recomposeColor(
          fromColor
        )})`;
      },
      height: theme.spacing(10),
      width: '200%',
    },
    slider: {
      "&[type='range']": {
        appearance: 'none',
        cursor: 'pointer',
        outline: 'none',
        height: theme.spacing(10),
        width: 0,
        '&::-moz-range-thumb': {
          background: theme.palette.grey[50],
          width: '100vw',
          height: 4,
          boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, 0.15)',
          border: 'none',
        },
        '&::-moz-focus-outer': {
          border: 0,
        },
        '&:active::-webkit-slider-thumb': {
          boxShadow: '0px 5px 10px -2px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  })
);

export const HeatSlider: React.FC<FcProps> = (props) => {
  const max = props.max || 2;
  const min = props.min || -2;
  const [rate, setRate] = useState<number>(0.5);
  const classes = useStyles({ rate });

  return (
    <div className={classes.background}>
      <VerticalInput
        className={classes.slider}
        min={min}
        max={max}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          const rate = (value - min) / (max - min);
          setRate(rate);
          props.onChange?.call(this, value);
        }}
      />
    </div>
  );
};
