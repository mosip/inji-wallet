import {
  EsignetMosipVCItemContentProps,
  ExistingMosipVCItemContentProps,
} from './VC/Views/VCCardViewContent';
import {VerifiableCredential} from '../types/VC/ExistingMosipVC/vc';
import {ImageBackground} from 'react-native';
import {Theme} from './ui/styleUtils';
import React from 'react';
import {ProfileIcon} from './ProfileIcon';
import {VCMetadata} from '../shared/VCMetadata';
import {SvgImage} from './ui/svg';

export const VcItemContainerProfileImage = (
  props: ExistingMosipVCItemContentProps | EsignetMosipVCItemContentProps,
) => {
  const imageUri = faceImageSource(props);

  return imageUri ? (
    <ImageBackground
      imageStyle={Theme.Styles.faceImage}
      source={{uri: imageUri}}
      style={Theme.Styles.closeCardImage}>
      {props?.isPinned && SvgImage.pinIcon()}
    </ImageBackground>
  ) : (
    <>
      <ProfileIcon
        isPinned={props?.isPinned}
        profileIconContainerStyles={Theme.Styles.ProfileIconContainer}
        profileIconSize={30}
      />
    </>
  );
};

export function faceImageSource(props: faceImageSourceProps) {
  return new VCMetadata(props?.vcMetadata)?.isFromOpenId4VCI()
    ? props?.credential?.credentialSubject?.face
    : props?.context?.credential?.biometrics?.face;
}

interface faceImageSourceProps {
  vcMetadata: VCMetadata;
  credential: VerifiableCredential;
  context: any;
}
