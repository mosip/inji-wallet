import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, View} from 'react-native';
import {Overlay, CheckBox} from 'react-native-elements';
import {Button, Column, Text, Row} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
// import CheckBox from 'expo-checkbox';

export const FaceVerificationAlertOverlay: React.FC<
  FaceVerificationAlertProps
> = props => {
  const {t} = useTranslation('ScanScreen');

  const [isConsentGiven, setIsConsentGiven] = useState(false);

  return (
    <Overlay
      isVisible={props.isVisible}
      onBackdropPress={props.close}
      overlayStyle={Theme.BindingVcWarningOverlay.overlay}>
      <Column
        align="space-between"
        crossAlign="center"
        padding={'10'}
        width={Dimensions.get('screen').width * 0.8}
        height={Dimensions.get('screen').height * 0}>
        <Row align="center" crossAlign="center" margin={'30 40 20 0'}>
          {SvgImage.ShareWithSelfie()}
          <Text
            margin={'0 0 0 -80'}
            color={Theme.Colors.whiteText}
            weight="bold">
            !
          </Text>
        </Row>

        <Column crossAlign="center" margin="10 0 15 0">
          <Text testID="alert" weight="bold" size="large" color="#000000">
            {t('shareWithSelfie')}
          </Text>

          <Text
            testID="warningMsg"
            align="center"
            size="mediumSmall"
            weight="regular"
            margin="20 0 0 0"
            color="#5D5D5D">
            {t('shareWithSelfieMessage')}
          </Text>
        </Column>

        <Button
          testID="yesConfirm"
          margin={'30 0 0 0'}
          type="gradient"
          title={t('ConfirmButton')}
          onPress={() => props.onConfirm(isConsentGiven)}
        />

        <Row
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: -25,
          }}>
          <CheckBox
            checked={isConsentGiven}
            checkedIcon={SvgImage.CheckedIcon()}
            uncheckedIcon={SvgImage.UnCheckedIcon()}
            onPress={() => setIsConsentGiven(!isConsentGiven)}
          />
          <Text
            size="small"
            weight="semibold"
            style={{color: '#9B9B9B', alignSelf: 'center', marginLeft: -15}}>
            {t('doNotAskMessage')}
          </Text>
        </Row>
      </Column>
    </Overlay>
  );
};

interface FaceVerificationAlertProps {
  isVisible: boolean;
  onConfirm: (isConsentGiven: boolean) => void;
  close: () => void;
}
