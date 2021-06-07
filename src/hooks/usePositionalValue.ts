import { useState } from 'react';
import { PositionalOption } from '../logics/core/melody';

type NewFunc = () => void;
type EditFunc<T> = (id: number, value: PositionalOption<T>) => void;
type DeleteFunc = (id: number) => void;

export function usePositionalValues<T>(
  initial: PositionalOption<T>[]
): [PositionalOption<T>[], NewFunc, EditFunc<T>, DeleteFunc] {
  const [values, setValues] = useState<PositionalOption<T>[]>(initial);

  const newValues = () => {
    const last = values[values.length - 1];
    setValues([
      ...values,
      {
        value: last.value,
        position: last.position + 1,
      },
    ]);
  };

  const editValues = (id: number, value: PositionalOption<T>) => {
    const copied = [...values];
    copied[id] = value;
    setValues([...copied]);
  };

  const deleteValues = (id: number) => {
    setValues(values.filter((_, i) => i !== id));
  };

  return [values, newValues, editValues, deleteValues];
}
