import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Column, Row } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { Text } from '../../components/ui';
import { Icon } from 'react-native-elements';
import { useQrLogin } from './QrLoginController';
import { Modal } from '../../components/ui/Modal';
import { Dimensions, Image } from 'react-native';

export const QrLoginWarning: React.FC<QrLoginWarningProps> = (props) => {
  const { t } = useTranslation('QrScreen');
  const controller = useQrLogin();

  return (
    <Modal
      isVisible={controller.isShowWarning}
      arrowLeft={<Icon name={''} />}
      headerTitle={t('confirmation')}
      headerElevation={5}
      onDismiss={props.onCancel}>
      <Column
        fill
        align="space-between"
        padding={'24 0 0 0'}
        style={{ display: props.isVisible ? 'flex' : 'none' }}
        backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        <Column align="space-evenly" crossAlign="center" padding={'16 16 0 16'}>
          <Image source={Theme.DomainWarningLogo} resizeMethod="auto" />
          <Text
            align="center"
            style={Theme.Styles.detailsText}
            margin="21 15 15 15">
            {t('domainWarning')}
          </Text>
          <Text
            align="center"
            margin={'30 15 0 10'}
            weight="regular"
            style={Theme.Styles.urlContainer}>
            {controller.logoUrl}
          </Text>
        </Column>

        <Column padding={'0 14 14 14'}>
          <Text
            align="center"
            weight="semibold"
            style={Theme.TextStyles.smaller}
            margin="0 15 15 15">
            {t('checkDomain')}
          </Text>
          <Row
            align="space-evenly"
            padding={'9'}
            crossAlign="center"
            style={Theme.Styles.lockDomainContainer}>
            <Icon name="lock" size={20} color={'grey'} type="font-awesome" />
            <Text
              weight="semibold"
              style={Theme.TextStyles.smaller}
              color={Theme.Colors.GrayIcon}>
              {t('domainHead')}
            </Text>
          </Row>
        </Column>

        <Column
          padding={'10'}
          width={Dimensions.get('screen').width * 0.98}
          style={Theme.Styles.bottomButtonsContainer}>
          <Button
            margin={'2 12 0 12'}
            title={t('confirm')}
            onPress={props.onConfirm}
            styles={Theme.ButtonStyles.radius}
          />
          <Button
            margin={'20 12 0 12'}
            type="clear"
            title={t('common:cancel')}
            onPress={props.onCancel}
            styles={Theme.ButtonStyles.clear}
          />
        </Column>
      </Column>
    </Modal>
  );
};

interface QrLoginWarningProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
