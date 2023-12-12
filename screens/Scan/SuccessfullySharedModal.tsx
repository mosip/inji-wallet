import React from 'react';
import {useTranslation} from 'react-i18next';
import {Theme} from '../../components/ui/styleUtils';
import {Modal} from '../../components/ui/Modal';
import {Image} from 'react-native';
import {Column, Text} from '../../components/ui';
import {Button} from '../../components/ui';
import {useScanLayout} from './ScanLayoutController';
import {useSendVcScreen} from './SendVcScreenController';
import testIDProps from '../../shared/commonUtil';
import {SvgImage} from '../../components/ui/svg';

export const SharingSuccessModal: React.FC<
  SharingSuccessModalProps
> = props => {
  const {t} = useTranslation('ScanScreen');
  const scanLayoutController = useScanLayout();
  const sendVcScreenController = useSendVcScreen();

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
          {SvgImage.SuccessMessageIcon()}
          <Text margin="20 0" style={Theme.TextStyles.bold} size={'large'}>
            {t('ScanScreen:status.accepted.title')}
          </Text>
          <Text
            align="center"
            style={Theme.TextStyles.regular}
            color={Theme.Colors.statusMessage}>
            {t('ScanScreen:status.accepted.message')}
          </Text>
          <Text style={Theme.TextStyles.bold}>
            {sendVcScreenController.receiverInfo.name}
          </Text>
        </Column>
        <Column margin="0 0  0">
          <Button
            type="gradient"
            title={t('ScanScreen:status.accepted.gotohome')}
            onPress={scanLayoutController.DISMISS}
          />
        </Column>
      </Modal>
    </React.Fragment>
  );
};

interface SharingSuccessModalProps {
  isVisible: boolean;
  testId: string;
}
