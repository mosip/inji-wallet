import React from 'react';
import {
  Button as RNEButton,
  ButtonProps as RNEButtonProps,
} from 'react-native-elements';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { Colors, Spacing, spacing } from './styleUtils';

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  solid: {
    backgroundColor: Colors.Orange,
  },
  clear: {
    backgroundColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Colors.Orange,
  },
  container: {
    minHeight: 48,
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  block: {
    width: '100%',
  },
});

export const Button: React.FC<ButtonProps> = (props) => {
  const type = props.type || 'solid';
  const buttonStyle: StyleProp<ViewStyle> = [styles[type]];

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    props.disabled ? styles.disabled : null,
    props.margin ? spacing('margin', props.margin) : null,
    props.styles,
  ];

  const handleOnPress = (event: GestureResponderEvent) => {
    if (!props.disabled && props.onPress) {
      props.onPress(event);
    }
  };

  return (
    <RNEButton
      buttonStyle={[buttonStyle, styles.block]}
      containerStyle={[props.fill ? styles.fill : null, containerStyle]}
      type={props.type}
      raised={props.raised}
      title={
        <Text
          weight="semibold"
          align="center"
          color={type === 'solid' ? Colors.White : Colors.Orange}>
          {props.title}
        </Text>
      }
      style={[buttonStyle, styles.block]}
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
