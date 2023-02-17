import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Centered, Column, Text } from './ui';
import { Modal } from './ui/Modal';
import { Image, View } from 'react-native';
import { Theme } from './ui/styleUtils';
import Loader from 'react-native-three-dots-loader';

export const ProgressingModal: React.FC<ProgressingModalProps> = (props) => {
  const { t } = useTranslation('ScanScreen');

  return (
    <React.Fragment>
      <Modal
        isVisible={props.isVisible}
        headerLeft={t(props.title)}
        onDismiss={props.onCancel}
        headerLabel={props.label}
        headerElevation={3}
        requester={props.requester}>
        <Centered crossAlign="center" fill>
          <Column margin="24 0" align="space-around">
            <Image
              source={Theme.InjiProgressingLogo}
              height={2}
              width={2}
              style={{ marginBottom: 15 }}
            />
            <Loader size={7} activeBackground={Theme.Colors.Loading} />
          </Column>

          <Column style={{ display: props.timeoutHint ? 'flex' : 'none' }}>
            <Column style={Theme.SelectVcOverlayStyles.timeoutHintContainer}>
              <Text
                align="center"
                color={Theme.Colors.TimoutText}
                style={Theme.TextStyles.bold}>
                {t('ScanScreen:status.sharing.timeoutHint')}
              </Text>
              <Button
                type="clear"
                title={t('common:cancel')}
                onPress={props.onCancel}
              />
            </Column>
          </Column>
        </Centered>
      </Modal>
    </React.Fragment>
  );
};

export interface ProgressingModalProps {
  isVisible: boolean;
  title?: string;
  label?: string;
  timeoutHint?: string;
  onCancel?: () => void;
  requester?: boolean;
}
