import React from 'react';
import {Theme} from './styleUtils';
import PinICon from '../../assets/Pin_Icon.svg';
import InjiSmallLogo from '../../assets/inji_small_logo.svg';
import FingerPrint from '../../assets/fingerprint_icon.svg';
import LockIcon from '../../assets/lock_icon.svg';
import InjiLogo from '../../assets/inji_home_logo.svg';
import DigitalIdentity from '../../assets/digital_identity_icon.svg';
import HelpIcon from '../../assets/Help_Icon.svg';
import ReceiveCard from '../../assets/Receive_Card.svg';
import ReceivedCards from '../../assets/Received_Cards.svg';

export class SvgImage {
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

  static HelpIcon() {
    return (
      <HelpIcon
        color1={Theme.Colors.linearGradientStart}
        color2={Theme.Colors.linearGradientEnd}
        stroke={Theme.Colors.IconBg}
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
}
