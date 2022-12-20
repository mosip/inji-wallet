/* eslint-disable sonarjs/no-duplicate-string */
import { StyleSheet, ViewStyle } from 'react-native';
import { Spacing } from '../styleUtils';

const Colors = {
  Black: '#231F20',
  Grey: '#B0B0B0',
  Grey5: '#E0E0E0',
  Grey6: '#F2F2F2',
  Orange: '#F2811D',
  LightGrey: '#FAF9FF',
  White: '#FFFFFF',
  Red: '#EB5757',
  Green: '#219653',
  Purple: '#70308C',
  Transparent: 'transparent',
  Warning: '#f0ad4e',
};

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const PurpleTheme = {
  Colors: {
    TabItemText: Colors.Purple,
    Details: Colors.White,
    DetailsLabel: Colors.White,
    AddIdBtnBg: Colors.Purple,
    AddIdBtnTxt: Colors.Purple,
    ClearAddIdBtnBg: 'transparent',
    noUinText: Colors.Purple,
    IconBg: Colors.Purple,
    Icon: Colors.Purple,
    GrayIcon: Colors.Grey,
    Loading: Colors.Purple,
    borderBottomColor: Colors.Grey6,
    whiteBackgroundColor: Colors.White,
    lightGreyBackgroundColor: Colors.LightGrey,
    profileLanguageValue: Colors.Grey,
    profileVersion: Colors.Grey,
    profileAuthFactorUnlock: Colors.Grey,
    profileLabel: Colors.Black,
    profileValue: Colors.Grey,
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
  },
  Styles: StyleSheet.create({
    title: {
      color: '#231F20',
      backgroundColor: 'transparent',
    },
    loadingTitle: {
      color: 'transparent',
      backgroundColor: '#B0B0B0',
      borderRadius: 4,
    },
    subtitle: {
      backgroundColor: 'transparent',
    },
    loadingSubtitle: {
      backgroundColor: '#B0B0B0',
      borderRadius: 4,
    },
    closeDetails: {
      flex: 1,
      flexDirection: 'row',
      paddingRight: 90,
    },
    loadingContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#F2F2F2',
      borderRadius: 4,
      margin: 5,
    },
    vertloadingContainer: {
      flex: 1,
      backgroundColor: '#F2F2F2',
      borderRadius: 4,
      margin: 5,
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
      marginBottom: 10,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: -1, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 4,
    },
    labelPartContainer: {
      marginLeft: 16,
    },
    labelPart: {
      marginTop: 10,
    },
    openCardBgContainer: {
      margin: 8,
      shadowColor: '#000',
      shadowOffset: { width: -1, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 3,
      elevation: 5,
      padding: 10,
    },
    backgroundImageContainer: {
      flex: 1,
      padding: 10,
      borderBottomColor: Colors.Grey,
      borderBottomWidth: 1,
    },
    successTag: {
      backgroundColor: '#219653',
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
    homeCloseCardDetailsHeader: {
      flex: 1,
      justifyContent: 'space-between',
    },
    logo: {
      height: 30,
      width: 30,
    },
    openDetailsContainer: {
      flex: 1,
      padding: 10,
    },
    closeCardImage: {
      width: 105,
      height: 135,
      borderRadius: 5,
    },
    details: {
      width: 290,
      marginLeft: 110,
      marginTop: 0,
    },
    openCardImage: {
      width: 105,
      height: 135,
      borderRadius: 5,
    },
    scannerContainer: {
      borderWidth: 4,
      borderColor: '#231F20',
      borderRadius: 32,
      justifyContent: 'center',
      height: 300,
      width: 300,
      overflow: 'hidden',
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
      backgroundColor: '#70308C',
    },
    tabContainer: {
      backgroundColor: 'transparent',
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
      backgroundColor: '#70308C',
      minHeight: 280,
      width: '100%',
      margin: 0,
      borderRadius: 4,
    },
    appSlider: {},
    sliderTitle: {
      color: '#FFFFFF',
      marginBottom: 20,
      fontFamily: 'Poppins_700Bold',
    },
    text: {
      color: '#FFFFFF',
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
      backgroundColor: Colors.Purple,
    },
    clear: {
      backgroundColor: Colors.Transparent,
    },
    outline: {
      backgroundColor: Colors.Transparent,
      borderColor: Colors.Purple,
    },
    container: {
      minHeight: 48,
      flexDirection: 'row',
    },
    disabled: {
      opacity: 0.5,
    },
    addId: {
      backgroundColor: Colors.Purple,
    },
    clearAddIdBtnBg: {
      backgroundColor: Colors.Transparent,
    },
    radius: {
      flex: 1,
      borderRadius: 10,
      backgroundColor: Colors.Orange,
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
      backgroundColor: Colors.Purple,
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
  OpenCard: require('../../../purpleAassets/bg_cart_one.png'),
  CloseCard: require('../../../purpleAassets/cart_unsel.png'),
  ProfileIcon: require('../../../purpleAassets/profile_icon_unsel.png'),
  MosipLogo: require('../../../purpleAassets/logo.png'),
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
