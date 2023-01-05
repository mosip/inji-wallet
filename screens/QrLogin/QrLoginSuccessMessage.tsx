import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements';

import { Centered, Button, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';

export const QrLoginSuccess: React.FC<QrLoginSuccessProps> = (props) => {
  const { t } = useTranslation('QrScreen');
  return (
    <Centered
      fill
      padding={'30'}
      style={{ display: props.isVisible ? 'flex' : 'none' }}>
      <Icon
        name="check-circle"
        color={Theme.Colors.VerifiedIcon}
        size={84}
        containerStyle={{ margin: 4, bottom: 5 }}
      />
      <Text
        color={Theme.Colors.textLabel}
        style={Theme.TextStyles.semibold}
        align="center">
        {t('Resident logged into health portal')}
      </Text>
      <Button
        margin={'10 0 0 0'}
        styles={Theme.ButtonStyles.outline}
        title={t('Okay')}
        onPress={props.onPress}
      />
    </Centered>
  );
};

interface QrLoginSuccessProps {
  isVisible: boolean;
  onPress: () => void;
}
