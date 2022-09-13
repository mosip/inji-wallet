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
  Transparent: 'transparent',
};

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const DefaultTheme = {
  Colors: {
    TabItemText: Colors.Orange,
    Details: Colors.Black,
    DetailsLabel: Colors.Orange,
    AddIdBtnBg: Colors.Orange,
    AddIdBtnTxt: Colors.Orange,
    ClearAddIdBtnBg: Colors.Transparent,
    Loading: Colors.Orange,
    noUinText: Colors.Orange,
    IconBg: Colors.Orange,
    Icon: Colors.Orange,
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
    labelPartContainer: {
      marginLeft: 16,
    },
    labelPart: {
      marginTop: 10,
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
      height: 30,
      width: 30,
    },
    homeCloseCardDetailsHeader: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    details: {
      width: 290,
      marginLeft: 110,
      marginTop: 0,
    },
    openDetailsContainer: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 10,
    },
    closeCardImage: {
      width: 100,
      height: 100,
      borderRadius: 5,
    },
    openCardImage: {
      width: 100,
      height: 100,
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
  OpenCard: require('../../../assets/ID-open.png'),
  CloseCard: require('../../../assets/ID-closed.png'),
  ProfileIcon: require('../../../assets/placeholder-photo.png'),
  MosipLogo: require('../../../assets/mosip-logo.png'),
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
