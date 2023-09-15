import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Centered, Column, Text} from './ui';
import {Modal} from './ui/Modal';
import {Image} from 'react-native';
import {Theme} from './ui/styleUtils';
import Spinner from 'react-native-spinkit';

export const ProgressingModal: React.FC<ProgressingModalProps> = props => {
  const {t} = useTranslation('ScanScreen');

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
              style={{marginBottom: 15, marginLeft: -6}}
            />
            {props.progress && (
              <Spinner
                type="ThreeBounce"
                color={Theme.Colors.Loading}
                style={{marginLeft: 6}}
              />
            )}
          </Column>
          {props.isHintVisible && (
            <Column style={Theme.SelectVcOverlayStyles.timeoutHintContainer}>
              <Text
                align="center"
                margin="10"
                color={Theme.Colors.TimoutHintText}
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
  title?: string;
  label?: string;
  hint?: string;
  onCancel?: () => void;
  onStayInProgress?: () => void;
  onRetry?: () => void;
  requester?: boolean;
  progress?: boolean | number;
}
