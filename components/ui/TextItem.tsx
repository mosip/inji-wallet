import React from 'react';
import { Column, Text } from '.';
import { Theme } from './styleUtils';
import testIDProps from '../../shared/commonUtil';

export const TextItem: React.FC<TextItemProps> = (props) => {
  return (
    <Column
      {...testIDProps(props.testID)}
      backgroundColor={Theme.Colors.whiteBackgroundColor}
      margin={props.margin}
      pX={24}
      pY={props.label ? 16 : 12}
      style={{
        borderColor: Theme.Colors.borderBottomColor,
        borderBottomWidth: props.divider ? 2 : 0,
        borderTopWidth: props.topDivider ? 2 : 0,
        alignItems: 'flex-start',
      }}>
      <Text
        color={Theme.Colors.textValue}
        weight={props.label ? 'semibold' : 'regular'}
        style={{ textAlign: 'left' }}>
        {props.text}
      </Text>
      {props.label && (
        <Text
          size="smaller"
          color={Theme.Colors.textLabel}
          weight="semibold"
          style={{ textAlign: 'left' }}>
          {props.label}
        </Text>
      )}
    </Column>
  );
};

interface TextItemProps {
  testID?: string;
  text: string;
  label?: string;
  divider?: boolean;
  topDivider?: boolean;
  margin?: string;
}
