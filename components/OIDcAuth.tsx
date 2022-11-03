import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Centered, Column, Text } from './ui';
import { ModalProps } from './ui/Modal';
import { Theme } from './ui/styleUtils';

export const OIDcAuthenticationModal: React.FC<OIDcAuthenticationModalProps> = (
  props
) => {
  const { t } = useTranslation('OIDcAuth');

  return (
    <View style={Theme.OIDCAuthStyles.viewContainer}>
      <Column safe fill align="space-between">
        <Centered fill>
          <Icon
            name="card-account-details-outline"
            color={Theme.Colors.Icon}
            size={30}
          />
          <Text
            align="center"
            weight="bold"
            margin="8 0 12 0"
            style={{ fontSize: 24 }}>
            {t('title')}
          </Text>
          <Text align="center">{t('text')}</Text>
          <Text
            align="center"
            color={Theme.Colors.errorMessage}
            margin="16 0 0 0">
            {props.error}
          </Text>
        </Centered>
        <Column>
          <Button title={t('verify')} onPress={() => props.onVerify()} />
        </Column>
      </Column>
    </View>
  );
};

interface OIDcAuthenticationModalProps extends ModalProps {
  onVerify: () => void;
  error?: string;
}
