import React from 'react';
import {Image, Pressable} from 'react-native';
import {Theme} from '../ui/styleUtils';
import testIDProps from '../../shared/commonUtil';
import {Text} from '../ui';
import {displayType} from '../../machines/issuersMachine';

export const Issuer: React.FC<IssuerProps> = (props: IssuerProps) => {
  function getIssuerLogo() {
    return {uri: props.displayDetails.logo.url};
  }

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
      <Image
        {...testIDProps(`issuerIcon-${props.testID}`)}
        style={Theme.IssuersScreenStyles.issuerIcon}
        alt={props.displayDetails.logo.alt_text}
        source={getIssuerLogo()}
      />
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

interface IssuerProps {
  displayDetails: displayType;
  onPress: () => void;
  testID: string;
}
