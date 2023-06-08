/* eslint-disable sonarjs/no-duplicate-string */
import { Dimensions, StyleSheet, ViewStyle } from 'react-native';
import { Spacing } from '../styleUtils';

const Colors = {
  Black: '#231F20',
  Grey: '#B0B0B0',
  Grey5: '#E0E0E0',
  Grey6: '#F2F2F2',
  Gray9: '#171717',
  DimGray: '#737373',
  Orange: '#F2811D',
  LightGrey: '#f7f5f0',
  White: '#FFFFFF',
  Red: '#EB5757',
  Green: '#219653',
  Transparent: 'transparent',
  Warning: '#f0ad4e',
  LightOrange: '#fce7e3',
};

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const DefaultTheme = {
  Colors: {
    TabItemText: Colors.Orange,
    Details: Colors.Black,
    DetailsLabel: Colors.Orange,
    LoadingDetailsLabel: Colors.Orange,
    AddIdBtnBg: Colors.Orange,
    AddIdBtnTxt: Colors.Orange,
    ClearAddIdBtnBg: Colors.Transparent,
    Loading: Colors.Orange,
    noUinText: Colors.Orange,
    IconBg: Colors.Orange,
    Icon: Colors.Orange,
    GrayIcon: Colors.Grey,
    borderBottomColor: Colors.Grey6,
    whiteBackgroundColor: Colors.White,
    lightGreyBackgroundColor: Colors.LightGrey,
    profileLanguageValue: Colors.Grey,
    profileVersion: Colors.Grey,
    profileAuthFactorUnlock: Colors.Grey,
    profileLabel: Colors.Black,
    profileValue: Colors.Grey,
    switchHead: Colors.Orange,
    switchTrackTrue: Colors.LightOrange,
    switchTrackFalse: Colors.Grey,
    overlayBackgroundColor: Colors.White,
    rotatingIcon: Colors.Grey5,
    loadingLabel: Colors.Grey6,
    textLabel: Colors.Grey,
    textValue: Colors.Black,
    errorMessage: Colors.Red,
    QRCodeBackgroundColor: Colors.LightGrey,
    ReceiveVcModalBackgroundColor: Colors.LightGrey,
    ToastItemText: Colors.White,
    VerifiedIcon: Colors.Green,
    whiteText: Colors.White,
    flipCameraIcon: Colors.Black,
    IdInputModalBorder: Colors.Grey,
    inputSelection: Colors.Orange,
    checkCircleIcon: Colors.White,
    OnboardingCircleIcon: Colors.White,
    OnboardingCloseIcon: Colors.White,
    WarningIcon: Colors.Warning,
    ProfileIconBg: Colors.LightOrange,
    Cursor: Colors.Orange,
    version: Colors.DimGray,
    poweredByBLE: Colors.Gray9,
  },
  Styles: StyleSheet.create({
    title: {
      color: Colors.Black,
      backgroundColor: Colors.Transparent,
    },
    loadingTitle: {
      color: Colors.Transparent,
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    subtitle: {
      backgroundColor: Colors.Transparent,
    },
    loadingSubtitle: {
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    statusLabel: {
      color: Colors.Black,
    },
    verifiedIconContainer: {
      marginLeft: 5,
    },
    verifiedIconInner: {
      backgroundColor: 'white',
      borderRadius: 10,
    },
    vcItemLabelHeader: {
      color: Colors.Orange,
    },
    closeDetails: {
      flex: 1,
      flexDirection: 'row',
      paddingRight: 90,
    },
    loadingContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
    loadingCardDetailsContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
    cardDetailsContainer: {},
    vertloadingContainer: {
      flex: 1,
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
      padding: 5,
    },
    closeDetailsContainer: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    logoContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginLeft: 300,
    },
    closeCardBgContainer: {
      borderRadius: 10,
      margin: 8,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: -1, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 4,
    },
    selectedBindedVc: {
      borderRadius: 10,
      margin: 5,
      borderWidth: 2,
      borderColor: Colors.Green,
    },
    labelPartContainer: {
      marginLeft: 16,
      flex: 1,
    },
    urlContainer: {
      backgroundColor: Colors.White,
      padding: 10,
      borderRadius: 12,
      fontSize: 12,
    },
    lockDomainContainer: {
      backgroundColor: Colors.White,
      alignSelf: 'center',
      borderRadius: 15,
      width: 100,
    },
    bottomButtonsContainer: {
      height: 120,
      borderTopLeftRadius: 27,
      borderTopRightRadius: 27,
      padding: 6,
      backgroundColor: Colors.White,
    },
    consentPageTop: {
      backgroundColor: Colors.White,
      height: 160,
      borderRadius: 6,
    },
    consentDottedLine: {
      width: 182,
      borderWidth: 2,
      margin: 5,
      borderStyle: 'dashed',
      borderRadius: 1,
      borderColor: 'grey',
    },
    labelPart: {
      marginTop: 10,
      alignItems: 'flex-start',
    },
    openCardBgContainer: {
      borderRadius: 10,
      margin: 8,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: -1, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 4,
      padding: 10,
    },
    backgroundImageContainer: {
      flex: 1,
      padding: 10,
    },
    successTag: {
      backgroundColor: Colors.Green,
      height: 43,
      flex: 1,
      alignItems: 'center',
      paddingLeft: 6,
    },
    closeDetailsHeader: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 18,
      margin: 6,
    },
    openDetailsHeader: {
      flex: 1,
      justifyContent: 'space-between',
    },
    logo: {
      height: 35,
      width: 90,
    },
    loadingCardDetailsHeader: {
      flex: 1,
      justifyContent: 'space-between',
    },
    cardDetailsHeader: {
      flex: 1,
      justifyContent: 'space-between',
    },
    mosipLogoContainer: {},
    details: {
      width: 290,
      marginLeft: 110,
      marginTop: 0,
    },
    openDetailsContainer: {
      flex: 1,
      padding: 10,
    },
    profileIconBg: {
      padding: 8,
      width: 40,
      height: 40,
      borderRadius: 6,
      backgroundColor: Colors.LightOrange,
    },
    domainVerifiyIcon: {
      padding: 20,
      marginLeft: 120,
      width: 130,
      height: 130,
      borderRadius: 60,
      borderWidth: 10,
      borderColor: Colors.White,
      backgroundColor: Colors.LightOrange,
    },
    closeCardImage: {
      width: 105,
      height: 135,
      borderRadius: 5,
    },
    openCardImage: {
      width: 105,
      height: 135,
      borderRadius: 5,
    },
    scannerContainer: {
      borderWidth: 4,
      borderColor: Colors.Black,
      borderRadius: 32,
      justifyContent: 'center',
      height: 300,
      width: 300,
      overflow: 'hidden',
      marginLeft: 18,
    },
    scanner: {
      height: 400,
      width: '100%',
      margin: 'auto',
    },
    flipIconButton: {
      alignSelf: 'center',
      alignItems: 'center',
    },
    tabIndicator: {
      backgroundColor: Colors.Orange,
    },
    tabContainer: {
      backgroundColor: Colors.Transparent,
      justifyContent: 'center',
    },
    tabView: {
      flex: 1,
    },
    detailsText: {
      fontWeight: 'bold',
      fontSize: 15,
      fontFamily: 'Poppins_700Bold',
    },
    getId: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    placeholder: {
      fontFamily: 'Poppins_400Regular',
    },
    warningText: {
      color: Colors.Red,
      fontSize: 18,
    },
  }),
  PinInputStyle: StyleSheet.create({
    input: {
      borderBottomWidth: 1,
      borderColor: Colors.Grey,
      color: Colors.Black,
      flex: 1,
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 18,
      fontWeight: '600',
      height: 40,
      lineHeight: 28,
      margin: 8,
      textAlign: 'center',
    },
  }),
  TextStyles: StyleSheet.create({
    base: {
      color: Colors.Black,
      fontSize: 18,
      lineHeight: 28,
    },
    regular: {
      fontFamily: 'Poppins_400Regular',
    },
    semibold: {
      fontFamily: 'Poppins_600SemiBold',
    },
    bold: {
      fontFamily: 'Poppins_700Bold',
    },
    small: {
      fontSize: 14,
      lineHeight: 21,
    },
    smaller: {
      fontSize: 12,
      lineHeight: 18,
    },
  }),
  VcItemStyles: StyleSheet.create({
    title: {
      color: Colors.Black,
      backgroundColor: 'transparent',
    },
    loadingTitle: {
      color: 'transparent',
      backgroundColor: Colors.Grey5,
      borderRadius: 4,
    },
    subtitle: {
      backgroundColor: 'transparent',
      flex: 1,
    },
    loadingSubtitle: {
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    container: {
      backgroundColor: Colors.White,
    },
    loadingContainer: {
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
  }),
  ToastItemStyles: StyleSheet.create({
    toastContainer: {
      backgroundColor: Colors.Orange,
      position: 'absolute',
      alignSelf: 'center',
      top: 80,
      borderRadius: 4,
    },
    messageContainer: {
      fontSize: 12,
    },
  }),
  ButtonStyles: StyleSheet.create({
    fill: {
      flex: 1,
    },
    solid: {
      backgroundColor: Colors.Orange,
    },
    clear: {
      backgroundColor: Colors.Transparent,
    },
    outline: {
      backgroundColor: Colors.Transparent,
      borderColor: Colors.Orange,
    },
    container: {
      minHeight: 48,
      flexDirection: 'row',
    },
    disabled: {
      opacity: 0.5,
    },
    addId: {
      backgroundColor: Colors.Orange,
    },
    clearAddIdBtnBg: {
      backgroundColor: Colors.Transparent,
    },
    radius: {
      borderRadius: 10,
      backgroundColor: Colors.Orange,
    },
  }),
  OIDCAuthStyles: StyleSheet.create({
    viewContainer: {
      backgroundColor: Colors.White,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
      padding: 32,
    },
  }),
  SelectVcOverlayStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
    },
  }),
  AppMetaDataStyles: StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      left: 0,
      right: 'auto',
    },
    view: {
      flex: 1,
      width: Dimensions.get('screen').width,
    },
    contentView: {
      flex: 1,
      padding: 20,
    },
    header: {
      fontSize: 20,
      fontWeight: 'normal',
      color: 'rgb(28,28,30)',
    },
  }),
  FooterStyles: StyleSheet.create({
    bottom: {
      justifyContent: 'flex-end',
      backgroundColor: Colors.Grey6,
      borderRadius: 15,
      padding: 10,
    },
  }),
  ModalStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
  }),
  UpdateModalStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
  }),
  TextEditOverlayStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
    },
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
  }),
  PasscodeStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
  }),
  MessageOverlayStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
    },
    button: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
  }),
  BindingVcWarningOverlay: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
      borderRadius: 15,
    },
    button: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
  }),
  RevokeStyles: StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      left: 0,
      right: 'auto',
    },
    view: {
      flex: 1,
      width: Dimensions.get('screen').width,
    },
    revokeView: { padding: 20 },
    flexRow: { flexDirection: 'row', margin: 0, padding: 0 },
    rowStyle: { flexDirection: 'column', justifyContent: 'space-between' },
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 999,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
  }),
  VerifyIdentityOverlayStyles: StyleSheet.create({
    content: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      backgroundColor: Colors.White,
    },
  }),
  RevokeConfirmStyles: StyleSheet.create({
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 999999,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
  }),
  OtpVerificationStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
    viewContainer: {
      backgroundColor: Colors.White,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
      padding: 32,
    },
    close: {
      position: 'absolute',
      top: 32,
      right: 0,
      color: Colors.Orange,
    },
  }),
  MessageStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
    },
    button: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
  }),
  VidItemStyles: StyleSheet.create({
    title: {
      color: Colors.Black,
      backgroundColor: 'transparent',
    },
    loadingTitle: {
      color: 'transparent',
      backgroundColor: Colors.Grey5,
      borderRadius: 4,
    },
    subtitle: {
      backgroundColor: 'transparent',
    },
    loadingSubtitle: {
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    container: {
      backgroundColor: Colors.White,
    },
    loadingContainer: {
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
  }),
  OnboardingOverlayStyles: StyleSheet.create({
    overlay: {
      padding: 24,
      bottom: 86,
      backgroundColor: 'transparent',
      shadowColor: 'transparent',
    },
    slide: {
      width: '100%',
      padding: 20,
    },
    slider: {
      backgroundColor: Colors.Orange,
      minHeight: 300,
      width: '100%',
      margin: 0,
      borderRadius: 4,
    },
    appSlider: {},
    sliderTitle: {
      color: Colors.White,
      marginBottom: 20,
      fontFamily: 'Poppins_700Bold',
    },
    text: {
      color: Colors.White,
    },
    paginationContainer: {
      margin: 10,
    },
    paginationDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    closeIcon: {
      alignItems: 'flex-end',
      end: 16,
      top: 40,
      zIndex: 1,
    },
  }),
  claimsContainer: StyleSheet.create({
    container: {
      backgroundColor: Colors.Transparent,
    },
  }),
  OpenCard: require('../../../assets/ID-open.png'),
  CloseCard: require('../../../assets/ID-closed.png'),
  ProfileIcon: require('../../../assets/placeholder-photo.png'),
  MosipSplashLogo: require('../../../assets/icon.png'),
  MosipLogo: require('../../../assets/mosip-logo.png'),
  DomainWarningLogo: require('../../../assets/domain-warning.png'),
  WarningLogo: require('../../../assets/warningLogo.png'),
  OtpLogo: require('../../../assets/otp-mobile-logo.png'),
  SuccessLogo: require('../../../assets/success-logo.png'),

  elevation(level: ElevationLevel): ViewStyle {
    // https://ethercreative.github.io/react-native-shadow-generator/

    if (level === 0) {
      return null;
    }

    const index = level - 1;

    return {
      shadowColor: Colors.Black,
      shadowOffset: {
        width: 0,
        height: [1, 1, 1, 2, 2][index],
      },
      shadowOpacity: [0.18, 0.2, 0.22, 0.23, 0.25][index],
      shadowRadius: [1.0, 1.41, 2.22, 2.62, 3.84][index],
      elevation: level,
      zIndex: level,
      borderRadius: 4,
      backgroundColor: Colors.White,
    };
  },
  spacing(type: 'margin' | 'padding', values: Spacing) {
    if (Array.isArray(values) && values.length === 2) {
      return {
        [`${type}Horizontal`]: values[0],
        [`${type}Vertical`]: values[1],
      };
    }

    const [top, end, bottom, start] =
      typeof values === 'string' ? values.split(' ').map(Number) : values;

    return {
      [`${type}Top`]: top,
      [`${type}End`]: end != null ? end : top,
      [`${type}Bottom`]: bottom != null ? bottom : top,
      [`${type}Start`]: start != null ? start : end != null ? end : top,
    };
  },
};
