import React from 'react';
import {useTranslation} from 'react-i18next';
import {Theme} from '../../components/ui/styleUtils';
import {Modal} from '../../components/ui/Modal';
import {Pressable, Dimensions} from 'react-native';
import {Column, Row, Text} from '../../components/ui';
import {useScanLayout} from './ScanLayoutController';
import {useSendVcScreen} from './SendVcScreenController';
import testIDProps from '../../shared/commonUtil';
import {SvgImage} from '../../components/ui/svg';
import {Icon} from 'react-native-elements';

export const SharingSuccessModal: React.FC<
  SharingSuccessModalProps
> = props => {
  const {t} = useTranslation('ScanScreen');
  const scanLayoutController = useScanLayout();

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
          {SvgImage.SuccessLogo()}
          <Text
            testID="successfullySharedTitle"
            margin="20 0"
            style={Theme.TextStyles.bold}
            size={'large'}>
            {t('status.accepted.title')}
          </Text>
          <Text
            testID="successfullySharedMessage"
            align="center"
            style={Theme.TextStyles.regular}
            color={Theme.Colors.statusMessage}>
            {t('status.accepted.message')}
          </Text>
        </Column>
        <Row
          align="space-evenly"
          style={{marginBottom: Dimensions.get('screen').height * 0.06}}>
          <Pressable testID="successfulVcSharedHomeIcon">
            <Icon
              name="home"
              color={Theme.Colors.Icon}
              size={33}
              containerStyle={
                Theme.SelectVcOverlayStyles.sharedSuccessfullyIconStyle
              }
              onPress={scanLayoutController.GOTO_HOME}
            />
            <Text align="center" weight="bold">
              {t('status.accepted.home')}
            </Text>
          </Pressable>
          <Pressable testID="successfulVcSharedHistoryIcon">
            <Icon
              name="history"
              color={Theme.Colors.Icon}
              size={33}
              containerStyle={
                Theme.SelectVcOverlayStyles.sharedSuccessfullyIconStyle
              }
              onPress={scanLayoutController.GOTO_HISTORY}
            />
            <Text align="center" weight="bold">
              {t('status.accepted.history')}
            </Text>
          </Pressable>
        </Row>
      </Modal>
    </React.Fragment>
  );
};

interface SharingSuccessModalProps {
  isVisible: boolean;
  testId: string;
}
