import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { Button, Column, Row, Text } from '../../../components/ui';
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
        padding={'10'}
        width={Dimensions.get('screen').width * 0.8}
        height={Dimensions.get('screen').height * 0.5}>
        <Row align="center">
          <Icon
            name={'warning'}
            size={50}
            color={Theme.Colors.WarningIcon}
            type="ionicon"
          />
        </Row>
        <Column>
          <Text align="center" size="regular">
            {t('BindingWarning')}
          </Text>
        </Column>
        <Column padding={'20'}>
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
      </Column>
    </Overlay>
  );
};

interface QrLoginWarningProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
