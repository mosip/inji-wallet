import React from 'react';
import {
  Button as RNEButton,
  ButtonProps as RNEButtonProps,
} from 'react-native-elements';
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { Text } from './Text';
import { Theme, Spacing } from './styleUtils';

export const Button: React.FC<ButtonProps> = (props) => {
  const type = props.type || 'solid';
  const buttonStyle: StyleProp<ViewStyle> = [
    Theme.ButtonStyles.fill,
    Theme.ButtonStyles[type],
  ];

  const containerStyle: StyleProp<ViewStyle> = [
    Theme.ButtonStyles.container,
    props.disabled ? Theme.ButtonStyles.disabled : null,
    props.margin ? Theme.spacing('margin', props.margin) : null,
    props.styles,
  ];

  const handleOnPress = (event: GestureResponderEvent) => {
    if (!props.disabled && props.onPress) {
      props.onPress(event);
    }
  };

  return (
    <RNEButton
      buttonStyle={buttonStyle}
      containerStyle={[
        props.fill ? Theme.ButtonStyles.fill : null,
        containerStyle,
      ]}
      type={props.type}
      raised={props.raised}
      title={
        <Text
          weight="semibold"
          align="center"
          color={
            type === 'solid' || type === 'addId'
              ? Theme.Colors.whiteText
              : Theme.Colors.AddIdBtnTxt
          }>
          {props.title}
        </Text>
      }
      style={[buttonStyle]}
      icon={props.icon}
      onPress={handleOnPress}
      loading={props.loading}
    />
  );
};

interface ButtonProps {
  title: string;
  disabled?: boolean;
  margin?: Spacing;
  type?: RNEButtonProps['type'];
  onPress?: RNEButtonProps['onPress'];
  fill?: boolean;
  raised?: boolean;
  loading?: boolean;
  icon?: RNEButtonProps['icon'];
  styles?: StyleProp<ViewStyle>;
}
