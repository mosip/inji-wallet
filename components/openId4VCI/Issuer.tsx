import React from 'react';
import {Pressable} from 'react-native';
import {Theme} from '../ui/styleUtils';
import testIDProps from '../../shared/commonUtil';
import {Text} from '../ui';
import {displayType} from '../../machines/issuersMachine';
import {SvgImage} from '../ui/svg';

export const Issuer: React.FC<IssuerProps> = (props: IssuerProps) => {
  return (
    <Pressable
      {...testIDProps(`issuer-${props.testID}`)}
      onPress={props.onPress}
      style={({pressed}) =>
        pressed
          ? [
              Theme.IssuersScreenStyles.issuerBoxContainerPressed,
              Theme.Styles.boxShadow,
            ]
          : [
              Theme.IssuersScreenStyles.issuerBoxContainer,
              Theme.Styles.boxShadow,
            ]
      }>
      {SvgImage.IssuerIcon(props)}

      <Text
        testID={`issuerHeading-${props.testID}`}
        style={Theme.IssuersScreenStyles.issuerHeading}>
        {props.displayDetails.title}
      </Text>
      <Text
        testID={`issuerDescription-${props.testID}`}
        style={Theme.IssuersScreenStyles.issuerDescription}>
        {props.displayDetails.description}
      </Text>
    </Pressable>
  );
};

export interface IssuerProps {
  displayDetails: displayType;
  onPress: () => void;
  testID: string;
}
