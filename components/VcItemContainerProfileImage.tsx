import {ImageBackground} from 'react-native';
import {Theme} from './ui/styleUtils';
import React from 'react';
import {ProfileIcon} from './ProfileIcon';
import {SvgImage} from './ui/svg';

export const VcItemContainerProfileImage = ({verifiableCredentialData, isPinned}: VcItemContainerProfileImageProps) => {
  const imageUri = verifiableCredentialData.face;

  return imageUri ? (
    <ImageBackground
      imageStyle={Theme.Styles.faceImage}
      source={{uri: imageUri}}
      style={Theme.Styles.closeCardImage}>
      {isPinned && SvgImage.pinIcon()}
    </ImageBackground>
  ) : (
    <>
      <ProfileIcon
        isPinned={isPinned}
        profileIconContainerStyles={Theme.Styles.ProfileIconContainer}
        profileIconSize={30}
      />
    </>
  );
};

interface VcItemContainerProfileImageProps {
    verifiableCredentialData: any;
    isPinned?: boolean;
}