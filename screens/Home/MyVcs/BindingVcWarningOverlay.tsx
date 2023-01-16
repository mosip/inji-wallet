import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Button, Column, Text, Row } from '../../../components/ui';
import { Theme } from '../../../components/ui/styleUtils';

export const BindingVcWarningOverlay: React.FC<QrLoginWarningProps> = (
  props
) => {
  const { t } = useTranslation('VcDetails');

  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={Theme.BindingVcWarningOverlay.overlay}>
      <Column
        align="space-between"
        crossAlign="center"
        padding={'10'}
        width={Dimensions.get('screen').width * 0.8}>
        <Row align="center" crossAlign="center" margin={'0 80 0 0'}>
          <Image source={Theme.WarningLogo} resizeMethod="auto" />
          <Text
            margin={'0 0 0 -80'}
            color={Theme.Colors.whiteText}
            weight="bold">
            !
          </Text>
        </Row>

        <Text size="regular" weight="bold">
          {t('Alert')}
        </Text>

        <Text align="center" size="smaller">
          {t('BindingWarning')}
        </Text>

        <Button
          margin={'10 0 0 0'}
          type="radius"
          title={t('yes_confirm')}
          onPress={props.onConfirm}
        />

        <Button
          margin={'10 0 0 0'}
          type="clear"
          title={t('no')}
          onPress={props.onCancel}
        />
      </Column>
    </Overlay>
  );
};

interface QrLoginWarningProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
