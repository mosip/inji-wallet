import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Centered, Column, Text } from './ui';
import { Modal } from './ui/Modal';
import { Image } from 'react-native';
import { Theme } from './ui/styleUtils';
import PaginationDot from 'react-native-animated-pagination-dot';

export const ProgressingModal: React.FC<ProgressingModalProps> = (props) => {
  const { t } = useTranslation('ScanScreen');

  let n = 0;
  const [curPage, setCurPage] = useState(n);

  const highLightDot = () => setCurPage(n + 1);

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
              style={{ marginBottom: 15, marginLeft: -6 }}
            />
            {props.progress && (
              <PaginationDot
                activeDotColor={'black'}
                curPage={curPage}
                maxPage={3}
              />
            )}
          </Column>

          <Column style={{ display: props.timeoutHint ? 'flex' : 'none' }}>
            <Column style={Theme.SelectVcOverlayStyles.timeoutHintContainer}>
              <Text
                align="center"
                color={Theme.Colors.TimoutText}
                style={Theme.TextStyles.bold}>
                {props.timeoutHint}
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
  progress?: boolean | number;
  onBackdropPress?: () => void;
}
