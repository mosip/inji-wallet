import React from 'react';
import {useTranslation} from 'react-i18next';
import {Theme} from '../../components/ui/styleUtils';
import {Modal} from '../../components/ui/Modal';
import {Pressable, Dimensions, View} from 'react-native';
import {Button, Column, Row, Text} from '../../components/ui';
import testIDProps from '../../shared/commonUtil';
import {SvgImage} from '../../components/ui/svg';

export const SharingStatusModal: React.FC<SharingStatusModalProps> = props => {
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
          {props.image}
          <Text
            testID="sharingStatusTitle"
            margin="20 0"
            style={Theme.TextStyles.bold}
            size={'large'}>
            {props.title}
          </Text>
          <Text
            testID="sharingStatusMessage"
            align="center"
            margin="0 33 0 33"
            style={Theme.TextStyles.regular}
            color={Theme.Colors.statusMessage}>
            {props.message}
          </Text>
        </Column>
        {props.buttonStatus === 'homeAndHistoryIcons' ? (
          <Row
            align="space-evenly"
            style={{marginBottom: Dimensions.get('screen').height * 0.06}}>
            <Column>
              <Pressable
                accessible={false}
                testID="successfullyVcSharedHomeIcon"
                style={{height: 75, justifyContent: 'space-between'}}
                onPress={props.goToHome}>
                {SvgImage.SuccessHomeIcon()}
                <Text align="center" weight="bold">
                  {t('status.accepted.home')}
                </Text>
              </Pressable>
            </Column>

            <Column>
              <Pressable
                accessible={false}
                testID="successfullyVcSharedHistoryIcon"
                style={{height: 75, justifyContent: 'space-between'}}
                onPress={props.goToHistory}>
                {SvgImage.SuccessHistoryIcon()}
                <Text align="center" weight="bold">
                  {t('status.accepted.history')}
                </Text>
              </Pressable>
            </Column>
          </Row>
        ) : null}
        {props.gradientButtonTitle && (
          <Column
            style={{marginBottom: Dimensions.get('screen').height * 0.012}}>
            <Button
              testID="failedVcSharedRetryButton"
              type="gradient"
              title={props.gradientButtonTitle}
              onPress={props.onGradientButton}
            />
          </Column>
        )}
        {props.clearButtonTitle && (
          <Column align="center">
            <Button
              testID="failedVcSharedHomeButton"
              type="clear"
              styles={{marginBottom: 9}}
              title={props.clearButtonTitle}
              onPress={props.onClearButton}
            />
          </Column>
        )}
      </Modal>
    </React.Fragment>
  );
};

interface SharingStatusModalProps {
  isVisible: boolean;
  testId: string;
  buttonStatus?: String;
  title: String;
  message: String;
  image: React.ReactElement;
  gradientButtonTitle?: String;
  clearButtonTitle?: String;
  goToHome?: () => void;
  goToHistory?: () => void;
  onGradientButton?: () => void;
  onClearButton?: () => void;
}
