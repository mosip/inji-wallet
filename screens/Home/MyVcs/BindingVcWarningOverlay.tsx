import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Button, Column, Text, Row } from '../../../components/ui';
import { Theme } from '../../../components/ui/styleUtils';

export const BindingVcWarningOverlay: React.FC<QrLoginWarningProps> = (
  props
) => {
  const { t } = useTranslation('BindingVcWarningOverlay');

  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={Theme.BindingVcWarningOverlay.overlay}>
      <Column
        align="space-between"
        crossAlign="center"
        padding={'10'}
        width={Dimensions.get('screen').width * 0.8}
        height={Dimensions.get('screen').height * 0}>
        <Row align="center" crossAlign="center" margin={'0 80 -10 0'}>
          <Image source={Theme.WarningLogo} resizeMethod="auto" />
          <Text
            margin={'0 0 0 -80'}
            color={Theme.Colors.whiteText}
            weight="bold">
            !
          </Text>
        </Row>

        <Column crossAlign="center" margin="0 0 30 0">
          <Text weight="semibold">{t('alert')}</Text>

          <Text
            align="center"
            size="small"
            weight="semibold"
            color={Theme.Colors.GrayText}>
            {t('BindingWarning')}
          </Text>
        </Column>

        <Button
          margin={'30 0 0 0'}
          type="gradient"
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
