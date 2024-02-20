import React, { useState } from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, View} from 'react-native';
import {Overlay, CheckBox} from 'react-native-elements';
import {Button, Column, Text, Row} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
import { Svg } from 'react-native-svg';
// import CheckBox from 'expo-checkbox';

export const FaceVerificationAlertOverlay: React.FC<
  FaceVerificationAlertProps
> = props => {
  const {t} = useTranslation('FaceVerificationAlertOverlay');
  
  const [music, setMusic] = useState(false);
  
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

        <Column crossAlign="center" margin="10 0 30 0">
          <Text testID="alert" weight="semibold">
            {t('Okay da bue')}
          </Text>

          <Text
            testID="warningMsg"
            align="center"
            size="small"
            weight="semibold"
            margin="20 0 0 0"
            color={Theme.Colors.GrayText}>
            {t('To share your  Credentials, well securely verify your identity using face authentication. By continuing, you consent to INJI using your camera for this purpose. Your facial data will only be used for authentication and will not be shared with any third parties.'
           )}
         </Text>
        </Column>

        <Button
          testID="yesConfirm"
          margin={'30 0 0 0'}
          type="gradient"
          title={t('I understand')}
          onPress={() => props.onConfirm(!music)}
        />

        <View>
        <Row style={{justifyContent: 'center'}}>
          <CheckBox
            checked={music}
            checkedIcon={
              SvgImage.CheckedIcon()
            }
            uncheckedIcon={
              SvgImage.UnCheckedIcon()
            }
            onPress={()=>setMusic(!music)}
          />
          <Text style={{color: '#9B9B9B', alignSelf: 'center', marginLeft: -15}}>
            Don't ask me again
          </Text>
        </Row>
        </View>
      </Column>
    </Overlay>
  );
};

interface FaceVerificationAlertProps {
  isVisible: boolean;
  onConfirm: (showAgain: boolean) => void; //return fasle
  close: () => void;
}