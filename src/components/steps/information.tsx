import { Grid, TextField } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';

type FcProps = {
  onChangeBpm(bpm: number): void;
  onChangeTimeSignature(timeSignature: [number, number]): void;
  onChangeTimeSeconds(timeSeconds: number): void;
};

export const InformationStep: React.FC<FcProps> = (props) => {
  const [_, setTimeSignature] = useState([4, 4]);

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <TextField
          label="BPM"
          type="number"
          variant="outlined"
          defaultValue={120}
          onChange={(e) => {
            const bpm = parseFloat(e.target.value);
            props.onChangeBpm(bpm);
          }}
        />
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <Grid item>
            <TextField
              label="Time Signature"
              type="number"
              variant="outlined"
              defaultValue={4}
              onChange={(e) => {
                setTimeSignature((prev) => {
                  const value = parseInt(e.target.value);
                  const updated: [number, number] = [value, prev[1]];
                  props.onChangeTimeSignature(updated);
                  return updated;
                });
              }}
            />
          </Grid>
          <Grid item>/</Grid>
          <Grid item>
            <TextField
              type="number"
              variant="outlined"
              defaultValue={4}
              onChange={(e) => {
                setTimeSignature((prev) => {
                  const value = parseInt(e.target.value);
                  const updated: [number, number] = [prev[0], value];
                  props.onChangeTimeSignature(updated);
                  return updated;
                });
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <TextField
          label="Time Seconds"
          type="number"
          variant="outlined"
          defaultValue={60}
          onChange={(e) => {
            const time = parseFloat(e.target.value);
            props.onChangeTimeSeconds(time);
          }}
        />
      </Grid>
    </Grid>
  );
};
