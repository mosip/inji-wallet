import React from 'react';
import { Column, Text } from '.';
import { Theme } from './styleUtils';

export const TextItem: React.FC<TextItemProps> = (props) => {
  return (
    <Column
      backgroundColor={Theme.Colors.whiteBackgroundColor}
      margin={props.margin}
      pX={24}
      pY={props.label ? 16 : 12}
      style={{
        borderBottomColor: Theme.Colors.borderBottomColor,
        borderBottomWidth: props.divider ? 1 : 0,
      }}>
      {props.label && (
        <Text size="smaller" color={Theme.Colors.textLabel} weight="semibold">
          {props.label}
        </Text>
      )}
      <Text
        color={Theme.Colors.textValue}
        weight={props.label ? 'semibold' : 'regular'}>
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
