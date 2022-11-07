import React from 'react';
import { Column, Text } from '.';
import { Colors } from './styleUtils';

export const TextItem: React.FC<TextItemProps> = (props) => {
  return (
    <Column
      backgroundColor={Colors.White}
      margin={props.margin}
      pX={24}
      pY={props.label ? 16 : 12}
      style={{
        borderBottomColor: Colors.Grey6,
        borderBottomWidth: props.divider ? 1 : 0,
        alignItems: 'flex-start',
      }}>
      {props.label && (
        <Text size="smaller" color={Colors.Grey} weight="semibold">
          {props.label}
        </Text>
      )}
      <Text color={Colors.Black} weight={props.label ? 'semibold' : 'regular'}>
        {props.text}
      </Text>
    </Column>
  );
};

interface TextItemProps {
  text: string;
  label?: string;
  divider?: boolean;
  margin?: string;
}
