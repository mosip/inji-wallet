import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import { Button, Centered, Column, Row, Text } from './ui';
import { Theme } from './ui/styleUtils';

export const RevokeConfirmModal: React.FC<RevokeConfirmModalProps> = (
  props
) => {
  const { t } = useTranslation('ViewVcModal');

  return (
    <View style={Theme.RevokeConfirmStyles.viewContainer}>
      <Centered fill>
        <Column
          width={Dimensions.get('screen').width * 0.8}
          style={Theme.RevokeConfirmStyles.boxContainer}>
          <Text weight="semibold" margin="0 0 12 0">
            {t('revoke')}
          </Text>
          <Text margin="0 0 12 0">{t('revoking', { vid: props.id })}</Text>
          <Row>
            <Button
              fill
              type="clear"
              title={t('cancel')}
              onPress={() => props.onCancel()}
            />
            <Button fill title={t('revoke')} onPress={props.onRevoke} />
          </Row>
        </Column>
      </Centered>
    </View>
  );
};

interface RevokeConfirmModalProps {
  onCancel: () => void;
  onRevoke: () => void;
  id: string;
}
