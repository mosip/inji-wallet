import React from 'react';
import {
  Button as RNEButton,
  ButtonProps as RNEButtonProps,
} from 'react-native-elements';
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { Text } from './Text';
import { Theme, Spacing } from './styleUtils';
import LinearGradient from 'react-native-linear-gradient';

export const Button: React.FC<ButtonProps> = (props) => {
  const type = props.type || 'solid' || 'radius';
  const buttonStyle: StyleProp<ViewStyle> = [
    props.fill ? Theme.ButtonStyles.fill : null,
    Theme.ButtonStyles[type],
    { width: '100%' },
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

  return !props.linearGradient ? (
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
    <LinearGradient
      colors={['#F59B4B', '#E86E04']}
      style={
        props.isVcThere
          ? { width: '33%', borderRadius: 10, alignSelf: 'center' }
          : Theme.ButtonStyles.gradientButton
      }
      useAngle={true}
      angle={180}>
      <RNEButton
        type={props.type}
        raised={props.raised}
        title={
          <Text
            weight="semibold"
            style={Theme.TextStyles.small}
            color={
              type === 'solid' || type === 'gradientButton' || type === 'radius'
                ? Theme.Colors.whiteText
                : Theme.Colors.AddIdBtnTxt
            }>
            {props.title}
          </Text>
        }
        icon={props.icon}
        onPress={handleOnPress}
        loading={props.loading}
      />
    </LinearGradient>
  );
};

interface ButtonProps {
  title: string;
  disabled?: boolean;
  margin?: Spacing;
  type?: RNEButtonProps['type'];
  linearGradient?: boolean;
  isVcThere?: boolean;
  onPress?: RNEButtonProps['onPress'];
  fill?: boolean;
  raised?: boolean;
  loading?: boolean;
  icon?: RNEButtonProps['icon'];
  styles?: StyleProp<ViewStyle>;
}
