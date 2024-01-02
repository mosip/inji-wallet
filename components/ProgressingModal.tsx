import React from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Centered, Column, Text} from './ui';
import {Modal} from './ui/Modal';
import {Theme} from './ui/styleUtils';
import Spinner from 'react-native-spinkit';
import {SvgImage} from './ui/svg';

export const ProgressingModal: React.FC<ProgressingModalProps> = props => {
  const {t} = useTranslation('ScanScreen');

  return (
    <React.Fragment>
      <Modal
        isVisible={props.isVisible}
        headerTitle={t(props.title)}
        onDismiss={props.onCancel}
        headerElevation={3}
        modalStyle={Theme.ModalStyles.progressingModal}
        requester={props.requester}>
        <Centered crossAlign="center" fill>
          <Column margin="24 0" align="space-around">
            {SvgImage.ProgressIcon()}
            {props.progress && (
              <Spinner
                type="ThreeBounce"
                color={Theme.Colors.Loading}
                style={{marginLeft: 6}}
              />
            )}
          </Column>
          {(props.isHintVisible || props.isBleErrorVisible) && (
            <Column style={Theme.SelectVcOverlayStyles.timeoutHintContainer}>
              <Text
                align="center"
                margin="10"
                color={Theme.Colors.TimeoutHintText}
                size="small"
                style={Theme.TextStyles.bold}>
                {props.hint}
              </Text>
              {props.onStayInProgress && (
                <Button
                  type="clear"
                  title={t('status.stayOnTheScreen')}
                  onPress={props.onStayInProgress}
                />
              )}

              {props.onRetry && (
                <Button
                  type="clear"
                  title={t('status.retry')}
                  onPress={props.onRetry}
                />
              )}
            </Column>
          )}
        </Centered>
      </Modal>
    </React.Fragment>
  );
};

export interface ProgressingModalProps {
  isVisible: boolean;
  isHintVisible: boolean;
  isBleErrorVisible?: boolean;
  title?: string;
  hint?: string;
  onCancel?: () => void;
  onStayInProgress?: () => void;
  onRetry?: () => void;
  requester?: boolean;
  progress?: boolean | number;
}
