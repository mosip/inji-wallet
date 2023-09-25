import React from 'react';
import {Image, Pressable} from 'react-native';
import {Theme} from '../ui/styleUtils';
import {useTranslation} from 'react-i18next';
import testIDProps from '../../shared/commonUtil';
import {Text} from '../ui/Text';

export const Issuer: React.FC<IssuerProps> = (props: IssuerProps) => {
  const {t} = useTranslation('IssuersScreen');

  function getLogoImageSource() {
    if (props.logoUrl) return {uri: props.logoUrl};
    return Theme.DigitIcon;
  }

  return (
    <Pressable
      accessible={false}
      {...testIDProps(props.testID)}
      onPress={props.onPress}
      style={({pressed}) =>
        pressed
          ? [
              Theme.issuersScreenStyles.issuerBoxContainerPressed,
              Theme.Styles.boxShadow,
            ]
          : [
              Theme.issuersScreenStyles.issuerBoxContainer,
              Theme.Styles.boxShadow,
            ]
      }>
      <Image
        accessible={true}
        {...testIDProps('issuerIcon')}
        style={Theme.issuersScreenStyles.issuerIcon}
        source={getLogoImageSource()}
      />
      <Text
        accessible={false}
        testID="heading"
        style={Theme.issuersScreenStyles.issuerHeading}>
        {t('itemHeading', {issuer: props.displayName})}
      </Text>
      <Text
        accessible={false}
        testID="description"
        style={Theme.issuersScreenStyles.issuerDescription}>
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
