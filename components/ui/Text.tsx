import React from 'react';
import { StyleProp, TextStyle, StyleSheet, Text as RNText } from 'react-native';
import { Colors, spacing } from './styleUtils';

const styles = StyleSheet.create({
  base: {
    color: Colors.Black,
    fontSize: 18,
    lineHeight: 28,
  },
  regular: {
    fontFamily: 'Poppins_400Regular',
  },
  semibold: {
    fontFamily: 'Poppins_600SemiBold',
  },
  bold: {
    fontFamily: 'Poppins_700Bold',
  },
  small: {
    fontSize: 14,
    lineHeight: 21,
  },
  smaller: {
    fontSize: 12,
    lineHeight: 18,
  },
});

export const Text: React.FC<TextProps> = (props: TextProps) => {
  const weight = props.weight || 'regular';

  const textStyles: StyleProp<TextStyle> = [
    styles.base,
    styles[weight],
    props.color ? { color: props.color } : null,
    props.align ? { textAlign: props.align } : null,
    props.margin ? spacing('margin', props.margin) : null,
    props.size ? styles[props.size] : null,
    props.style ? props.style : null,
  ];

  return (
    <RNText style={textStyles} numberOfLines={props.numLines}>
      {props.children}
    </RNText>
  );
};

interface TextProps {
  children: React.ReactNode;
  color?: string;
  weight?: 'regular' | 'semibold' | 'bold';
  align?: TextStyle['textAlign'];
  margin?: string;
  size?: 'small' | 'smaller' | 'regular';
  lineHeight?: number;
  numLines?: number;
  style?: StyleProp<TextStyle>;
}
