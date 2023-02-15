import React from 'react';
import {
  Button as RNEButton,
  ButtonProps as RNEButtonProps,
} from 'react-native-elements';
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { Text } from './Text';
import { Theme, Spacing } from './styleUtils';

export const Button: React.FC<ButtonProps> = (props) => {
  const type = props.type || 'solid' || 'radius' || 'gradient';
  const buttonStyle: StyleProp<ViewStyle> = [
    props.fill ? Theme.ButtonStyles.fill : null,
    Theme.ButtonStyles[type],
    { width: '100%' },
  ];

  const containerStyle: StyleProp<ViewStyle> = [
    !(type === 'gradient') ? Theme.ButtonStyles.container : null,
    props.disabled ? Theme.ButtonStyles.disabled : null,
    props.margin ? Theme.spacing('margin', props.margin) : null,
    type === 'gradient'
      ? props.isVcThere
        ? Theme.ButtonStyles.float
        : Theme.ButtonStyles.gradient
      : null,
    props.styles,
  ];

  const handleOnPress = (event: GestureResponderEvent) => {
    if (!props.disabled && props.onPress) {
      props.onPress(event);
    }
  };

  return !(type === 'gradient') ? (
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
            type === 'solid' || type === 'addId' || type === 'radius'
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
  ) : (
    <RNEButton
      ViewComponent={require('react-native-linear-gradient').default}
      linearGradientProps={{
        colors: !props.disabled
          ? Theme.Colors.GradientColors
          : Theme.Colors.DisabledColors,
      }}
      containerStyle={
        props.isVcThere ? containerStyle : Theme.ButtonStyles.gradient
      }
      type={props.type}
      raised={props.raised}
      title={
        <Text
          weight="bold"
          style={Theme.TextStyles.bold}
          color={
            type === 'solid' || type === 'gradient' || type === 'radius'
              ? Theme.Colors.whiteText
              : Theme.Colors.DownloadIdBtnTxt
          }>
          {props.title}
        </Text>
      }
      buttonStyle={!props.isVcThere ? { height: 45 } : { height: 39 }}
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
  isVcThere?: boolean;
  onPress?: RNEButtonProps['onPress'];
  fill?: boolean;
  raised?: boolean;
  loading?: boolean;
  icon?: RNEButtonProps['icon'];
  styles?: StyleProp<ViewStyle>;
}
