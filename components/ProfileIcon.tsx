import {Theme} from './ui/styleUtils';
import {ImageBackground, View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-elements';
import {SvgImage} from './ui/svg';
import testIDProps from '../shared/commonUtil';
import {
  EsignetMosipVCItemContentProps,
  ExistingMosipVCItemContentProps,
} from './VC/MosipVCItem/MosipVCItemContent';
import {VerifiableCredential} from '../types/VC/ExistingMosipVC/vc';
import {VCMetadata} from '../shared/VCMetadata';

export const ProfileIcon: React.FC = props => {
  return (
    <React.Fragment>
      <View
        style={Theme.Styles.ProfileIconContainer}
        {...testIDProps(`ProfileIconOuter`)}>
        {props?.isPinned && SvgImage.pinIcon()}
        <View
          {...testIDProps(`ProfileIconInner`)}
          style={[
            Theme.Styles.ProfileIconInnerStyle,
            !props?.isPinned && Theme.Styles.ProfileIconPinnedStyle,
          ]}>
          <Icon
            {...testIDProps(`ProfileIcon`)}
            name="person"
            color={Theme.Colors.Icon}
            size={40}
          />
        </View>
      </View>
    </React.Fragment>
  );
};

export const VcItemContainerProfileImage = (
  props: ExistingMosipVCItemContentProps | EsignetMosipVCItemContentProps,
  verifiableCredential: VerifiableCredential,
) => {
  const imageUri = faceImageSource(props, verifiableCredential);
  return verifiableCredential && imageUri ? (
    <ImageBackground
      imageStyle={Theme.Styles.faceImage}
      source={{uri: imageUri}}
      style={Theme.Styles.closeCardImage}>
      {props?.isPinned && SvgImage.pinIcon()}
    </ImageBackground>
  ) : (
    <>
      <ProfileIcon isPinned={props?.isPinned} />
    </>
  );
};

function faceImageSource(
  props: faceImageSourceProps,
  verifiableCredential: VerifiableCredential,
) {
  return props?.vcMetadata?.isFromOpenId4VCI()
    ? verifiableCredential?.credentialSubject?.face
    : props?.context?.credential?.biometrics?.face;
}

interface faceImageSourceProps {
  vcMetadata: VCMetadata;
  verifiableCredential: VerifiableCredential;
  context: any;
}
