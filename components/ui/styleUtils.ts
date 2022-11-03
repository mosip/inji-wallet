import { ViewStyle } from 'react-native';
import { DefaultTheme } from './themes/DefaultTheme';

// To change the theme, CSS theme file has to import and assign it to Theme in line no 6

export const Theme = DefaultTheme;

type SpacingXY = [number, number];
type SpacingFull = [number, number, number, number];
export type Spacing = SpacingXY | SpacingFull | string;

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;
