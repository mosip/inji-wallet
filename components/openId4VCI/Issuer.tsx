import React from 'react';
import {Image, Pressable} from 'react-native';
import {Theme} from '../ui/styleUtils';
import {useTranslation} from 'react-i18next';
import testIDProps from '../../shared/commonUtil';
import {Text} from '../ui';

export const Issuer: React.FC<IssuerProps> = (props: IssuerProps) => {
  const {t} = useTranslation('IssuersScreen');

  function getIssuerLogo() {
    return {uri: props.logoUrl};
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
        source={getIssuerLogo()}
      />
      <Text
        testID={`issuerHeading-${props.testID}`}
        style={Theme.IssuersScreenStyles.issuerHeading}>
        {t('itemHeading', {issuer: props.displayName})}
      </Text>
      <Text
        testID={`issuerDescription-${props.testID}`}
        style={Theme.IssuersScreenStyles.issuerDescription}>
        {t('itemSubHeading')}
      </Text>
    </Pressable>
  );
};

interface IssuerProps {
  id: string;
  displayName: string;
  logoUrl: string;
  onPress: () => void;
  testID: string;
}
