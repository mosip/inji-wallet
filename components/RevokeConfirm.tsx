import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, Centered, Column, Row, Text } from './ui';
import { Colors } from './ui/styleUtils';

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: 'rgba(0,0,0,.6)',
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    position: 'absolute',
    top: 0,
    zIndex: 9,
  },
  boxContainer: {
    backgroundColor: Colors.White,
    padding: 24,
    elevation: 6,
    borderRadius: 4,
  },
});

export const RevokeConfirmModal: React.FC<RevokeConfirmModalProps> = (
  props
) => {
  const { t } = useTranslation('ViewVcModal');

  return (
    <View style={styles.viewContainer}>
      <Centered fill>
        <Column
          width={Dimensions.get('screen').width * 0.8}
          style={styles.boxContainer}>
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
