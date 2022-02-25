import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Icon } from 'react-native-elements';

export const RotatingIcon: React.FC<RotatingIconProps> = (props) => {
  const rotationValue = useRef(
    new Animated.Value(props.clockwise ? 0 : 1)
  ).current;

  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationValue, {
        toValue: props.clockwise ? 1 : 0,
        duration: props.duration || 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <Icon name={props.name} size={props.size} color={props.color} />
    </Animated.View>
  );
};

interface RotatingIconProps {
  name: string;
  size?: number;
  duration?: number;
  clockwise?: boolean;
  color?: string;
}
