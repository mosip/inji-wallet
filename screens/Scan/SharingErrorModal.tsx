import React from 'react';
import {useTranslation} from 'react-i18next';
import {Theme} from '../../components/ui/styleUtils';
import {Modal} from '../../components/ui/Modal';
import {Pressable, Dimensions} from 'react-native';
import {Button, Column, Text} from '../../components/ui';
import {useScanLayout} from './ScanLayoutController';
import {useSendVcScreen} from './SendVcScreenController';
import testIDProps from '../../shared/commonUtil';
import {SvgImage} from '../../components/ui/svg';
import {Icon} from 'react-native-elements';

export const SharingErrorModal: React.FC<
  FailureErrorOfVcShareProps
> = props => {
  const {t} = useTranslation('ScanScreen');

  return (
    <React.Fragment>
      <Modal
        isVisible={props.isVisible}
        showClose={false}
        {...testIDProps(props.testId)}>
        <Column
          margin="64 0"
          crossAlign="center"
          style={Theme.SelectVcOverlayStyles.sharedSuccessfully}>
          {SvgImage.ErrorLogo()}
          <Text
            testID="sharingErrorTitle"
            margin="20 0"
            style={Theme.TextStyles.bold}
            size={'large'}>
            {t('status.bleError.title')}
          </Text>
          <Text
            testID="sharingErrorMessage"
            margin="0 40 0 40"
            align="center"
            style={Theme.TextStyles.regular}
            color={Theme.Colors.statusMessage}>
            {t('status.bleError.message')}
          </Text>
        </Column>
        <Column
          align="space-evenly"
          style={{marginBottom: Dimensions.get('screen').height * 0.02}}>
          <Button
            testID="failedVcSharedRetryButton"
            type="gradient"
            title={t('status.bleError.retry')}
            onPress={props.onRetry}
          />
          <Button
            testID="failedVcSharedHomeButton"
            type="clear"
            styles={{marginTop: 12}}
            title={t('status.bleError.home')}
            onPress={props.onBackToHome}
          />
        </Column>
      </Modal>
    </React.Fragment>
  );
};

interface FailureErrorOfVcShareProps {
  testId: string;
  isVisible: boolean;
  onBackToHome: () => void;
  onRetry: () => void;
}
