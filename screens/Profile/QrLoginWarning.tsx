import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Column } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { Text } from '../../components/ui';

export const QrLoginWarning: React.FC<QrLoginWarningProps> = (props) => {
  const { t } = useTranslation('QrScreen');

  return (
    <Column
      fill
      align="space-evenly"
      padding={'10'}
      style={{ display: props.isVisible ? 'flex' : 'none' }}
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      <Column>
        <Text
          align="center"
          style={Theme.TextStyles.semibold}
          margin="16 0 0 0">
          {t('domainWarning')}
        </Text>
      </Column>
      <Column padding={'20'}>
        <Button
          margin={'10 0 0 0'}
          type="solid"
          title={t('confirm')}
          onPress={props.onConfirm}
        />
        <Button
          margin={'10 0 0 0'}
          type="outline"
          title={t('common:cancel')}
          onPress={props.onCancel}
        />
      </Column>
    </Column>
  );
};

interface QrLoginWarningProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
