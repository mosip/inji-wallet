import React from 'react';
import { Column, Text } from '.';
import { Colors } from './styleUtils';

export const TextItem: React.FC<TextItemProps> = (props) => {
  return (
    <Column
      backgroundColor={Colors.White}
      margin={props.margin}
      padding={props.label ? '16 24' : '12 24'}
      style={{
        borderBottomColor: Colors.Grey6,
        borderBottomWidth: props.divider ? 1 : 0,
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
