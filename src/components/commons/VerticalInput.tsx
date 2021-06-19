import { ChangeEvent, createElement, CSSProperties } from 'react';

type VerticalProp = {
  min: string | number;
  max: string | number;
  className?: string;
  style?: CSSProperties;
  onChange?(e: ChangeEvent<HTMLInputElement>): void;
};

const VerticalInput = (prop: VerticalProp) =>
  createElement('input', {
    type: 'range',
    orient: 'vertical',
    ...prop,
    style: {
      '-webkit-appearance': 'slider-vertical',
      ...prop.style,
    },
  });

export default VerticalInput;
