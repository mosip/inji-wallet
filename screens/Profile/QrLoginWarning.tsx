import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Column } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { Text } from '../../components/ui';
import { Icon } from 'react-native-elements';

export const QrLoginWarning: React.FC<QrLoginWarningProps> = (props) => {
  const { t } = useTranslation('QrScreen');

  return (
    <Column
      fill
      align="space-evenly"
      padding={'16'}
      style={{ display: props.isVisible ? 'flex' : 'none' }}
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      <Column>
        <Icon
          name="verified-user"
          size={60}
          style={Theme.Styles.domainVerifiyIcon}
          color={'orange'}
        />
        <Text align="center" style={Theme.TextStyles.base} margin="21 10 0 10">
          {t('domainWarning')}
        </Text>
      </Column>
      <Column padding={'20'}>
        <Button
          margin={'8 12 0 12'}
          type="solid"
          title={t('confirm')}
          onPress={props.onConfirm}
          styles={Theme.ButtonStyles.solid}
        />
        <Button
          margin={'20 12 0 12'}
          type="outline"
          title={t('common:cancel')}
          onPress={props.onCancel}
          styles={Theme.ButtonStyles.clear}
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
