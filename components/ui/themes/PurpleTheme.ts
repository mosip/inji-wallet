import { StyleSheet, ViewStyle } from 'react-native';

const colors = {
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
};

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const PurpleTheme = {
  Colors: {
    TabItemText: colors.Purple,
    Details: colors.White,
    DetailsLabel: colors.White,
    AddIdBtnBg: colors.Purple,
    AddIdBtnTxt: colors.Purple,
    ClearAddIdBtnBg: 'transparent',
    noUinText: colors.Purple,
    IconBg: colors.Purple,
    Icon: colors.Purple,
    Loading: colors.Purple,
    borderBottomColor: colors.Grey6,
    whiteBackgroundColor: colors.White,
    lightGreyBackgroundColor: colors.LightGrey,
    profileLanguageValue: colors.Grey,
    profileVersion: colors.Grey,
    profileAuthFactorUnlock: colors.Grey,
    profileLabel: colors.Black,
    profileValue: colors.Grey,
    overlayBackgroundColor: colors.White,
    rotatingIcon: colors.Grey5,
    loadingLabel: colors.Grey6,
    textLabel: colors.Grey,
    textValue: colors.Black,
    errorMessage: colors.Red,
    QRCodeBackgroundColor: colors.LightGrey,
    ReceiveVcModalBackgroundColor: colors.LightGrey,
    ToastItemText: colors.White,
    VerifiedIcon: colors.Green,
    whiteText: colors.White,
    flipCameraIcon: colors.Black,
    IdInputModalBorder: colors.Grey,
    inputSelection: colors.Orange,
    checkCircleIcon: colors.White,
    OnboardingCircleIcon: colors.White,
    OnboardingCloseIcon: colors.White,
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
      justifyContent: 'space-between',
      padding: 10,
    },
    closeCardImage: {
      width: 100,
      height: 100,
      borderRadius: 5,
    },
    details: {
      width: 290,
      marginLeft: 110,
      marginTop: 0,
    },
    openCardImage: {
      width: 100,
      height: 100,
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
      borderColor: colors.Grey,
      color: colors.Black,
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
      color: colors.Black,
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
      color: colors.Black,
      backgroundColor: 'transparent',
    },
    loadingTitle: {
      color: 'transparent',
      backgroundColor: colors.Grey5,
      borderRadius: 4,
    },
    subtitle: {
      backgroundColor: 'transparent',
    },
    loadingSubtitle: {
      backgroundColor: colors.Grey,
      borderRadius: 4,
    },
    container: {
      backgroundColor: colors.White,
    },
    loadingContainer: {
      backgroundColor: colors.Grey6,
      borderRadius: 4,
    },
  }),
  ToastItemStyles: StyleSheet.create({
    toastContainer: {
      backgroundColor: colors.Orange,
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
      backgroundColor: colors.Purple,
    },
    clear: {
      backgroundColor: colors.Transparent,
    },
    outline: {
      backgroundColor: colors.Transparent,
      borderColor: colors.Orange,
    },
    container: {
      minHeight: 48,
      flexDirection: 'row',
    },
    disabled: {
      opacity: 0.5,
    },
    addId: {
      backgroundColor: colors.Purple,
    },
    clearAddIdBtnBg: {
      backgroundColor: colors.Transparent,
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
      shadowColor: colors.Black,
      shadowOffset: {
        width: 0,
        height: [1, 1, 1, 2, 2][index],
      },
      shadowOpacity: [0.18, 0.2, 0.22, 0.23, 0.25][index],
      shadowRadius: [1.0, 1.41, 2.22, 2.62, 3.84][index],
      elevation: level,
      zIndex: level,
      borderRadius: 4,
      backgroundColor: colors.White,
    };
  },
  spacing(type: 'margin' | 'padding', values: string) {
    const [top, end, bottom, start] = values.split(' ').map(Number);

    return {
      [`${type}Top`]: top,
      [`${type}End`]: end != null ? end : top,
      [`${type}Bottom`]: bottom != null ? bottom : top,
      [`${type}Start`]: start != null ? start : end != null ? end : top,
    };
  },
};
