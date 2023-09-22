import React from 'react';
import {Image, Pressable} from 'react-native';
import {Theme} from '../ui/styleUtils';
import {useTranslation} from 'react-i18next';
import testIDProps from '../../shared/commonUtil';
import {Text} from '../ui/Text';

function isValidURL(urlString: string) {
  const urlPattern = new RegExp(
    `^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$`,
    'i',
  );
  return !!urlPattern.test(urlString);
}

export const Issuer: React.FC<IssuerProps> = (props: IssuerProps) => {
  /**
   * This check is added since the logo for Donwload via UIN/VID is present in the repo where as
   * other issuers has the logo url specfied in its data itself
   */

  const {t} = useTranslation('IssuersScreen');
  function getSource() {
    if (isValidURL(props.logoUrl)) return {uri: props.logoUrl};
    return props.logoUrl;
  }

  return (
    <Pressable
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
        {...testIDProps('issuerIcon')}
        style={Theme.issuersScreenStyles.issuerIcon}
        source={getSource()}
      />
      <Text testID="heading" style={Theme.issuersScreenStyles.issuerHeading}>
        {t('itemHeading', {issuer: props.displayName})}
      </Text>
      <Text
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
