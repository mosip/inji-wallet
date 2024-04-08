import {Pressable, View} from 'react-native';
import testIDProps from '../../shared/commonUtil';
import {Theme} from '../ui/styleUtils';
import {Text} from '../ui';
import React from 'react';
import {displayType} from '../../machines/Issuers/IssuersMachine';
import {SvgImage} from '../ui/svg';
import {getDisplayObjectForCurrentLanguage} from '../../shared/openId4VCI/Utils';
import {CredentialTypes} from '../../machines/VerifiableCredential/VCMetaMachine/vc';

export const CredentialType: React.FC<CredentialTypeProps> = props => {
  const selectedIssuerDisplayObject = getDisplayObjectForCurrentLanguage(
    props.item.display,
  );
  return (
    <Pressable
      accessible={false}
      {...testIDProps(`credentialTypeItem-${props.testID}`)}
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
      <View style={Theme.IssuersScreenStyles.issuerBoxIconContainer}>
        {SvgImage.IssuerIcon({
          ...props,
          displayDetails: selectedIssuerDisplayObject,
        })}
      </View>
      <View style={Theme.IssuersScreenStyles.issuerBoxContent}>
        <Text
          testID={`credentialTypeHeading-${props.testID}`}
          style={Theme.IssuersScreenStyles.issuerHeading}>
          {selectedIssuerDisplayObject?.name}
        </Text>
      </View>
    </Pressable>
  );
};

export interface CredentialTypeProps {
  displayDetails: displayType;
  onPress: () => void;
  testID: string;
  item: CredentialTypes;
}
