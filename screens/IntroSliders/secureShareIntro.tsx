import React from 'react';
import { Column, Row, Button, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { SvgImage } from '../../components/ui/svg';
import { Divider } from 'react-native-elements';
import { View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

export const StaticSendVcScreen: React.FC = () => {
    const staticCards = [
        { id: 1, name: 'Abigail', status: 'valid', pin: false, face: require("../../assets/faceImage2.png"), selected: true },
        { id: 2, name: 'Patricia', status: 'valid', pin: false, face: require("../../assets/faceImage1.png"), selected: true },
        { id: 3, name: 'Timara', status: 'valid', pin: false, face: require("../../assets/faceImage2.png"), selected: false },
        { id: 4, name: 'Abishek', status: 'valid', pin: false, face: require("../../assets/faceImage1.png"), selected: false },
    ];
    const { t } = useTranslation();
    const navigation = useNavigation();

    const handleShare = () => { };

    const handleShareWithSelfie = () => { };

    const handleReject = () => { };

    return (
        <Column fill backgroundColor={Theme.Colors.lightGreyBackgroundColor} style={Theme.IntroSliderStyles.secureShareIntroOuterColumn}>
            <View style={Theme.IntroSliderStyles.introScreenNotch}></View>
            <Row
                align="space-between"
                style={{
                    marginTop: 16,
                    paddingLeft: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: Theme.Colors.lightGreyBackgroundColor,
                }}>
                <Text weight='bold' size="large">
                    {t("SendVcScreen:introTitle")}
                </Text>
            </Row>
            <Row style={{ paddingHorizontal: 16 }}>
                <Text color={Theme.Colors.GrayText} size="extraSmall">
                    Philippines Government
                </Text>
            </Row>
            <Divider width={1}></Divider>
            <Column
                style={{
                    padding: 10,
                    margin: 16,
                    borderRadius: 8,
                    justifyContent: 'center',
                    backgroundColor: '#FFF2D6',
                }}>
                <Text color='#8B6105' size='small'>
                    {'<Philippines Govt.>'} {t('SendVcScreen:requestMessage')}
                    {'<Self-Authentication>'}.
                </Text>
            </Column>
            <Text
                margin="0 0 8 16"
                weight="bold"
                color={Theme.Colors.textValue}
                style={{ position: 'relative' }}>
                {t("SendVcScreen:pleaseSelectAnId")}
            </Text>
            <Row align="space-between" style={{ paddingHorizontal: 16 }}>
                <Text margin={"3 0 10 0"}>2 {t('SendVPScreen:cardsSelected')}</Text>
                <Text color={Theme.Colors.GradientColors[1]}>{t('SendVPScreen:unCheck')}</Text>
            </Row>
            <Column scroll>
                {staticCards.map(card => (
                    <LinearGradient colors={Theme.Colors.GradientColorsLight} start={Theme.LinearGradientDirection.start} end={Theme.LinearGradientDirection.end}><Row
                        key={card.id}
                        style={{
                            alignItems: 'center',
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: Theme.Colors.lightGreyBackgroundColor,
                            backgroundColor: card.selected
                                ? Theme.Colors.GradientColorsLight[0]
                                : Theme.Colors.whiteBackgroundColor,
                        }}>
                        <Column style={{ marginLeft: 5, flex: 1 }}>
                            <Row crossAlign='center'>
                                <View style={{ paddingRight: 10 }}>
                                    {card.selected ? SvgImage.CheckedIcon() : SvgImage.UnCheckedIcon()}
                                </View>
                                <Image style={{ height: 40, width: 40, marginRight: 10 }} source={card.face} />
                                <Column>
                                    <Text weight='bold'>{card.name}</Text>
                                    <Text
                                        size='extraSmall'
                                        style={{
                                            color: Theme.Colors.blackIcon,
                                        }}>
                                        {t("VcDetails:" + card.status)}
                                    </Text>
                                </Column>
                            </Row>
                        </Column>
                        {SvgImage.walletActivatedIcon()}
                    </Row></LinearGradient>
                ))}
            </Column>
            <Column
                style={{
                    padding: 16,
                    backgroundColor: Theme.Colors.whiteBackgroundColor,
                }}>
                <Button
                    type="gradient"
                    title="Share"
                    styles={{ marginVertical: 8 }}
                    onPress={handleShare}
                />
                <Button
                    type="gradient"
                    title="Share with Selfie"
                    styles={{ marginVertical: 8 }}
                    onPress={handleShareWithSelfie}
                />
                <Button
                    type="clear"
                    title="Reject"
                    onPress={handleReject}
                />
            </Column>
        </Column>
    );
};
