import React from 'react';
import Svg, {Image} from 'react-native-svg';
import {Theme} from './styleUtils';
import {Icon} from 'react-native-elements';
import {ImageBackground, View} from 'react-native';
import PinICon from '../../assets/Pin_Icon.svg';
import InjiSmallLogo from '../../assets/Inji_Logo.svg';
import FingerPrint from '../../assets/Finger_Print_Icon.svg';
import LockIcon from '../../assets/Lock_Icon.svg';
import InjiLogo from '../../assets/Inji_Home_Logo.svg';
import DigitalIdentity from '../../assets/Digital_Identity_Icon.svg';
import ReceiveCard from '../../assets/Receive_Card.svg';
import ReceivedCards from '../../assets/Received_Cards.svg';
import ProgressIcon from '../../assets/Progress_Icon.svg';
import testIDProps from '../../shared/commonUtil';
import Logo from '../../assets/Mosip_Logo.svg';
import WarningLogo from '../../assets/Warning_Icon.svg';
import OtpVerificationIcon from '../../assets/Otp_Verification_Icon.svg';
import FlipCameraIcon from '../../assets/Flip_Camera_Icon.svg';
import CameraCaptureIcon from '../../assets/Camera_Capture_Icon.svg';
import SuccessLogo from '../../assets/Success_Message_Icon.svg';
import NoInternetConnection from '../../assets/No_Internet_Connection.svg';
import SomethintWentWrong from '../../assets/Something_Went_Wrong.svg';
import MagnifierZoom from '../../assets/Magnifier_Zoom.svg';
import OpenCardBg from '../../assets/Open_Card_Bg.svg';

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
  static OpenCardBg() {
    return OpenCardBg;
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
