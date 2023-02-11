import React from 'react';
import { useTranslation } from 'react-i18next';
import { Centered, Column, Text } from './ui';
import { Modal } from './ui/Modal';
import { Image } from 'react-native';
import { Theme } from './ui/styleUtils';
import Loader from 'react-native-three-dots-loader';

export const InProgress: React.FC<InProgressProps> = (props) => {
  const { t } = useTranslation('ScanScreen');
  const progressTitle = props.title;

  return (
    <React.Fragment>
      <Modal
        isVisible={props.isVisible}
        headerLeft={t(props.title)}
        onDismiss={props.onCancel}
        headerLabel={props.label}
        headerElevation={3}>
        <Centered crossAlign="center" fill>
          <Column align="space-around">
            <Image
              source={Theme.InjiProgressingLogo}
              height={2}
              width={2}
              style={{ marginBottom: 15 }}
            />
            <Loader size={10} activeBackground={Theme.Colors.Loading} />
          </Column>
        </Centered>
      </Modal>
    </React.Fragment>
  );
};

export interface InProgressProps {
  isVisible: boolean;
  title?: string;
  label?: string;
  onCancel?: () => void;
}
