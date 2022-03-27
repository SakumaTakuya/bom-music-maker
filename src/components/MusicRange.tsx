import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Rnd } from 'react-rnd';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

type MusicRangeValue = {
  start: number;
  length: number;
};

type FcProp = {
  avatar: React.ReactNode;
  onChange?(value: MusicRangeValue): void;
};

type CssProps = {
  lineWidth: number;
};

const useStyles = makeStyles<Theme, CssProps>((theme) =>
  createStyles({
    musicalForm: {
      background: theme.palette.grey[100],
      borderRadius: 5,
      overflow: 'hidden',
      transitionDuration: '200ms',
      boxShadow:
        '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
    rndFrame: {
      background: theme.palette.grey[300],
      width: '60vw',
      overflow: 'scroll',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    rndControl: {
      position: 'relative',
      width: (props) => props.lineWidth,
      height: theme.spacing(10),
    },
    rndHandle: {
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      width: '24px',
      background: theme.palette.grey[400],
    },
  })
);

export const MusicRange: React.FC<FcProp> = (prop) => {
  const grid = 50;
  const classes = useStyles({
    lineWidth: grid * 40,
  });
  const [start, setStart] = useState(0);
  const [length, setLength] = useState(300);

  useEffect(() => {
    prop.onChange?.call(this, {
      start: start / grid,
      length: length / grid,
    });
  }, [start, length]);

  return (
    <Grid direction="row" container alignItems="center" spacing={1}>
      <Grid item>{prop.avatar}</Grid>
      <Grid item>
        <div className={classes.rndControl}>
          <Rnd
            className={classes.musicalForm}
            resizeHandleComponent={{
              right: (
                <div className={classes.rndHandle}>
                  <KeyboardArrowLeftIcon />
                </div>
              ),
            }}
            default={{
              x: 0,
              y: 0,
              width: grid * 3,
              height: '100%',
            }}
            dragAxis="x"
            enableResizing={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            resizeGrid={[grid, 0]}
            dragGrid={[grid, 0]}
            bounds="parent"
            minWidth={grid}
            onDragStop={(_, data) => {
              setStart(data.lastX);
            }}
            onResizeStop={(_, __, ___, delta) => {
              setLength((prevLength) => prevLength + delta.width);
            }}
          >
            {prop.children}
          </Rnd>
        </div>
      </Grid>
    </Grid>
  );
};
