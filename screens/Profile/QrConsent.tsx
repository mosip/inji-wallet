import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Centered, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useQrLogin } from './QrLoginController';

import { ListItem, Switch } from 'react-native-elements';

export const QrConsent: React.FC<QrConsentProps> = (props) => {
  const { t } = useTranslation('QrScreen');
  const accessOptions = [
    'Email Address',
    'Phone Number',
    'Gender',
    'Date of Birth',
  ];

  return (
    <Column
      fill
      align="space-evenly"
      padding="0 25 0 25"
      style={{ display: props.isVisible ? 'flex' : 'none' }}
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      <Text align="center" style={Theme.TextStyles.bold}>
        (A space for Icon)
      </Text>
      <Column backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        <Text weight="semibold">
          {t('Health portal is requesting access to:')}
        </Text>

        <Column padding="10 0 0 0">
          <ListItem>
            <Text color={Theme.Colors.textValue}>{t('Name and Picture')}</Text>
            <Text color={Theme.Colors.textLabel}>{t('REQUIRED')}</Text>
          </ListItem>
          {accessOptions.map((option) => (
            <ListItem>
              <Text>{t(option)}</Text>
              <Switch color={Theme.Colors.Icon} />
            </ListItem>
          ))}
          <Column padding="21 0 0 0">
            <Button
              styles={Theme.ButtonStyles.fill}
              title={'Confirm'}
              onPress={props.onConfirm}
            />
            <Button type="outline" title={'Cancel'} />
          </Column>
        </Column>
      </Column>
    </Column>
  );
};

interface QrConsentProps {
  isVisible?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}
