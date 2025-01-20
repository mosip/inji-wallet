import React from 'react';
import { Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useTranslation } from 'react-i18next';
import { View, Image } from 'react-native';

const QRScannerComponent: React.FC = () => (
    <Column crossAlign="center">
        <Column style={Theme.CameraEnabledStyles.scannerContainer}>
            <View
                style={[
                    Theme.CameraEnabledStyles.scannerContainer,
                    Theme.IntroSliderStyles.quickAccessIntroQrScanner,
                ]}
            >
                <Image
                    source={require('../../assets/ClipPathGroup.png')}
                    style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'cover',
                    }}
                />
            </View>
            <Column fill align="flex-start" style={{ marginTop: 24 }}>
                <Text
                    testID="holdPhoneSteadyMessage"
                    align="center"
                    style={Theme.CameraEnabledStyles.holdPhoneSteadyText}
                >
                    {useTranslation('ScanScreen').t('scanningGuide')}
                </Text>
            </Column>
        </Column>
    </Column>
);

export const StaticScanScreen: React.FC = () => {
    const { t } = useTranslation('ScanScreen');

    return (
        <View
            style={Theme.IntroSliderStyles.quickAccessIntroOuterView}
        >
            <View
                style={Theme.IntroSliderStyles.introScreenNotch}
            />
            <Column
                padding={[10, 25, 0, 32]}
                fill
                align="flex-start"
                style={Theme.IntroSliderStyles.quickAccessIntroOuterColumn}
            >
                <Column
                    backgroundColor={Theme.Colors.whiteBackgroundColor}
                >
                    <Text
                        align="left"
                        style={{ paddingBottom: 10, paddingLeft: 5 }}
                        weight="bold"
                        size="large"
                        color={Theme.Colors.blackIcon}
                    >
                        {t('MainLayout:share') || 'Share'}
                    </Text>
                </Column>
                <QRScannerComponent />
            </Column>
        </View>
    );
};
