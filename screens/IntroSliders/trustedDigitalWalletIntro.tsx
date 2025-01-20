import React from 'react';
import { Column } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { Row, Text } from '../../components/ui';
import { SvgImage } from '../../components/ui/svg';
import { LinearGradient } from 'react-native-linear-gradient';
import { Image, Icon } from 'react-native-elements';
import { ScrollView, View } from 'react-native';
import { HelpScreen } from '../../components/HelpScreen';
import { useTranslation } from 'react-i18next';
import { SearchBar } from '../../components/ui/SearchBar';


export const StaticHomeScreen: React.FC = () => {
    const { t } = useTranslation();
    const cards = [
        { id: 1, name: 'Abigail', status: 'valid', pin: false, face: require("../../assets/faceImage2.png") },
        { id: 2, name: 'Patricia', status: 'valid', pin: false, face: require("../../assets/faceImage1.png") },
        { id: 3, name: 'Timara', status: 'pending', pin: false, face: require("../../assets/faceImage2.png") },
        { id: 4, name: 'Abishek', status: 'valid', pin: false, face: require("../../assets/faceImage1.png") },
    ];

    return (
        <Column
            fill
            backgroundColor={Theme.Colors.whiteBackgroundColor}

            style={Theme.IntroSliderStyles.trustedDigitalWalletOuterColumn}>
            <View style={Theme.IntroSliderStyles.introScreenNotch}></View>

            <Row
                style={{
                    padding: 16,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: Theme.Colors.lightGreyBackgroundColor,
                }}>
                {SvgImage.InjiLogo({ height: 60, width: 120 })}
                <HelpScreen
                    isDisabled={true}
                    source={'Inji'}
                    triggerComponent={

                        <LinearGradient
                            style={{ borderRadius: 8 }}
                            colors={Theme.Colors.GradientColorsLight}
                            start={Theme.LinearGradientDirection.start}
                            end={Theme.LinearGradientDirection.end}>
                            <View style={Theme.HelpScreenStyle.viewStyle}>
                                <Row crossAlign="center" style={Theme.HelpScreenStyle.rowStyle}>
                                    <View
                                        testID="helpIcon"
                                        style={Theme.HelpScreenStyle.iconStyle}>
                                        {SvgImage.coloredInfo()}
                                    </View>
                                    <Text
                                        testID="helpText"
                                        style={Theme.HelpScreenStyle.labelStyle}>
                                        {t('IssuersScreen:help')}
                                    </Text>
                                </Row>
                            </View>
                        </LinearGradient>
                    }
                />
            </Row>
            <SearchBar
                isVcSearch
                    editable={false}
                placeholder={t('MyVcsTab:searchByName')}
            />
            {/* Card List */}
            <ScrollView style={{ flex: 1 }}>
                <Row
                    style={{
                        justifyContent: 'space-between',
                        padding: 16,
                        alignItems: 'center',
                    }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13 }}>4 {t('common:cards')}</Text>
                </Row>

                {cards.map(card => (
                    <Row
                        key={card.id}
                        style={{
                            alignItems: 'center',
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: Theme.Colors.lightGreyBackgroundColor,
                        }}>
                        {card.pin && SvgImage.pinIcon()}
                        <Image style={{ height: 40, width: 40, marginRight: 10 }} source={card.face}></Image>
                        <Column style={{ marginLeft: card.pin ? 8 : 0, flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>{card.name}</Text>
                            <Row>
                                <Text
                                    style={{
                                        color:
                                            card.status === 'valid'
                                                ? Theme.Colors.GrayText
                                                : Theme.Colors.GrayText,
                                    }}>
                                    {t("VcDetails:" + card.status)}
                                </Text></Row>
                        </Column>

                        {card.status === 'valid' && SvgImage.walletActivatedIcon()}
                        {card.status === 'pending' && SvgImage.walletUnActivatedIcon()}
                        <Icon name="dots-three-horizontal" type="entypo" color={Theme.Colors.GrayText} size={Theme.ICON_SMALL_SIZE} style={{ paddingHorizontal: 10 }} />
                    </Row>
                ))}
            </ScrollView>
        </Column>
    );
};
