import {
  EsignetMosipVCItemContentProps,
  ExistingMosipVCItemContentProps,
} from './VC/MosipVCItem/MosipVCItemContent';
import {VerifiableCredential} from '../types/VC/ExistingMosipVC/vc';
import {ImageBackground} from 'react-native';
import {Theme} from './ui/styleUtils';
import React from 'react';
import {SvgImage} from './ui/svg';
import {ProfileIcon} from './ProfileIcon';
import {VCMetadata} from '../shared/VCMetadata';

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
