import { ViewStyle } from 'react-native';

export const Colors = {
  Black: '#231F20',
  Grey: '#B0B0B0',
  Grey5: '#E0E0E0',
  Grey6: '#F2F2F2',
  Orange: '#F2811D',
  LightGrey: '#FAF9FF',
  White: '#FFFFFF',
  Red: '#EB5757',
  Green: '#219653',
};

type SpacingXY = [number, number];
type SpacingFull = [number, number, number, number];
export type Spacing = SpacingXY | SpacingFull | string;

export function spacing(type: 'margin' | 'padding', values: Spacing) {
  if (Array.isArray(values) && values.length === 2) {
    return {
      [`${type}Horizontal`]: values[0],
      [`${type}Vertical`]: values[1],
    };
  }

  const [top, end, bottom, start] =
    typeof values === 'string' ? values.split(' ').map(Number) : values;

  return {
    [`${type}Top`]: top,
    [`${type}End`]: end != null ? end : top,
    [`${type}Bottom`]: bottom != null ? bottom : top,
    [`${type}Start`]: start != null ? start : end != null ? end : top,
  };
}

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export function elevation(level: ElevationLevel): ViewStyle {
  // https://ethercreative.github.io/react-native-shadow-generator/

  if (level === 0) {
    return null;
  }

  const index = level - 1;

  return {
    shadowColor: Colors.Black,
    shadowOffset: {
      width: 0,
      height: [1, 1, 1, 2, 2][index],
    },
    shadowOpacity: [0.18, 0.2, 0.22, 0.23, 0.25][index],
    shadowRadius: [1.0, 1.41, 2.22, 2.62, 3.84][index],
    elevation: level,
    zIndex: level,
    borderRadius: 4,
    backgroundColor: Colors.White,
  };
}
