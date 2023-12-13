import React from 'react';
import Svg, {Image} from 'react-native-svg';
import {Theme} from './styleUtils';
import {Icon} from 'react-native-elements';
import {ImageBackground} from 'react-native';
import PinICon from '../../assets/Pin_Icon.svg';
import InjiSmallLogo from '../../assets/inji_small_logo.svg';
import FingerPrint from '../../assets/fingerprint_icon.svg';
import LockIcon from '../../assets/lock_icon.svg';
import InjiLogo from '../../assets/inji_home_logo.svg';
import DigitalIdentity from '../../assets/digital_identity_icon.svg';
import ReceiveCard from '../../assets/Receive_Card.svg';
import ReceivedCards from '../../assets/Received_Cards.svg';
import ProgressIcon from '../../assets/progress_icon.svg';
import testIDProps from '../../shared/commonUtil';
import Logo from '../../assets/MOSIP_LOGO.svg';
import WarningLogo from '../../assets/alert_icon.svg';
import OtpVerificationIcon from '../../assets/Otp_Verification_Icon.svg';
import FlipCameraIcon from '../../assets/Flip_Camera_Icon.svg';
import CameraCaptureIcon from '../../assets/Camera_Capture_Icon.svg';
import SuccessLogo from '../../assets/success_message_icon.svg';
import NoInternetConnection from '../../assets/No internet connection.svg';
import SomethintWentWrong from '../../assets/Something went wrong!.svg';
import MagnifierZoom from '../../assets/MagnifierZoom.svg';

export class SvgImage {
  static MosipLogo(props: LogoProps) {
    const {width, height} = props;
    return <Logo width={width} height={height} />;
  }
  static pinIcon() {
    return (
      <PinICon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        style={Theme.Styles.pinIcon}
      />
    );
  }

  static InjiSmallLogo() {
    return <InjiSmallLogo />;
  }

  static ProgressIcon() {
    return (
      <ProgressIcon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        color3={Theme.Colors.LinearGradientStroke}
        {...testIDProps('progressingLogo')}
      />
    );
  }

  static FingerPrint() {
    return (
      <FingerPrint
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        color3={Theme.Colors.LinearGradientStroke}
      />
    );
  }

  static LockIcon() {
    return (
      <LockIcon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        style={{alignSelf: 'center'}}
      />
    );
  }

  static InjiLogo() {
    return (
      <InjiLogo
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
      />
    );
  }

  static DigitalIdentity() {
    return (
      <DigitalIdentity
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
      />
    );
  }

  static ReceiveCard() {
    return (
      <ReceiveCard
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        stroke={Theme.Colors.IconBg}
      />
    );
  }

  static ReceivedCards() {
    return (
      <ReceivedCards
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        stroke={Theme.Colors.IconBg}
      />
    );
  }

  static IssuerIcon(props) {
    return (
      <Svg height="32" width="32">
        <Image
          href={getIssuerLogo(props)}
          x="0"
          y="0"
          height="32"
          width="32"
          preserveAspectRatio="xMidYMid slice"
        />
      </Svg>
    );
  }
  static WarningLogo() {
    return (
      <WarningLogo
        color1={Theme.Colors.warningLogoBgColor}
        color2={Theme.Colors.linearGradientEnd}
      />
    );
  }
  static OtpVerificationIcon() {
    return (
      <OtpVerificationIcon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
      />
    );
  }
  static ProfileImage(props) {
    return props.verifiableCredential ? (
      <ImageBackground
        imageStyle={Theme.Styles.faceImage}
        source={faceImageSource(props)}
        style={Theme.Styles.closeCardImage}>
        {props.isPinned && SvgImage.pinIcon()}
      </ImageBackground>
    ) : (
      <Icon name="person" color={Theme.Colors.Icon} size={88} />
    );
  }

  static FlipCameraIcon() {
    const {width, height} = Theme.Styles.cameraFlipIcon;
    return (
      <FlipCameraIcon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        width={width}
        height={height}
      />
    );
  }
  static CameraCaptureIcon() {
    return (
      <CameraCaptureIcon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
      />
    );
  }
  static SuccessLogo() {
    return <SuccessLogo />;
  }
  static NoInternetConnection() {
    return <NoInternetConnection />;
  }

  static SomethintWentWrong() {
    return <SomethintWentWrong />;
  }

  static MagnifierZoom() {
    return <MagnifierZoom />;
  }
}
1;

function getIssuerLogo(props) {
  return {uri: props.displayDetails.logo.url};
}

function faceImageSource(props) {
  return {
    uri: props.vcMetadata.isFromOpenId4VCI()
      ? props.verifiableCredential?.credentialSubject.face
      : props.context.credential.biometrics.face,
  };
}

interface LogoProps {
  width: number;
  height: number;
}
