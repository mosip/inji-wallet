import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import {Overlay} from 'react-native-elements';
import {Button, Column, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';

export const ConsentOverlay: React.FC<ConsentOverlayProps> = props => {
  const {t} = useTranslation('SendVPScreen');

  return (
    <Overlay
      isVisible={props.isVisible}
      // onBackdropPress={props.close}
      overlayStyle={Theme.BindingVcWarningOverlay.overlay}>
      <Column
        align="space-between"
        crossAlign="center"
        padding={'10'}
        width={Dimensions.get('screen').width * 0.8}
        height={Dimensions.get('screen').height * 0}>
        <Column crossAlign="center" margin="10 0 15 0" padding="0">
          <Text
            testID="consentRequired"
            weight="bold"
            size="large"
            color="#000000"
            style={{padding: 3}}>
            {t('consentRequired')}
          </Text>

          <Text
            testID="consentMsg"
            align="center"
            size="mediumSmall"
            weight="regular"
            margin="10 0 0 0"
            color="#5D5D5D">
            {t('consentMessage')}
          </Text>
        </Column>

        <Button
          testID="confirm"
          margin={'10 0 0 0'}
          type="gradient"
          title={t('confirmButton')}
          onPress={() => props.onConfirm()}
        />
        <Button
          testID="cancel"
          margin={'10 0 0 0'}
          type="clear"
          title={t('cancelButton')}
          onPress={() => props.onCancel()}
        />
      </Column>
    </Overlay>
  );
};

interface ConsentOverlayProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
