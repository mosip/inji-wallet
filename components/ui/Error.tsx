import {useFocusEffect} from '@react-navigation/native';
import React, {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import {BackHandler, Dimensions, View} from 'react-native';
import {Button, Column, Row, Text} from '.';
import {Header} from './Header';
import {Theme} from './styleUtils';
import testIDProps from '../../shared/commonUtil';
import {Modal} from './Modal';

export const Error: React.FC<ErrorProps> = props => {
  const {t} = useTranslation('common');
  const tryAgainButtonProps = {
    onPress: props.tryAgain,
    title: t(props.tryAgainButtonTranslationKey),
    testID: props.tryAgainButtonTranslationKey,
  };
  if (!props.goBackButtonVisible) {
    tryAgainButtonProps['width'] = Dimensions.get('screen').width * 0.54;
    tryAgainButtonProps['type'] = 'outline';
  }

  const errorContent = () => {
    return (
      <Fragment>
        <View style={{alignItems: 'center'}}>
          <View>
            <Row align="center" style={Theme.ErrorStyles.image}>
              {props.image}
            </Row>
            <Text style={Theme.ErrorStyles.title} testID="errorTitle">
              {props.title}
            </Text>
            <Text style={Theme.ErrorStyles.message} testID="errorMessage">
              {props.message}
            </Text>
            {props.helpText && (
              <Text style={Theme.ErrorStyles.message} testID="errorHelpText">
                {props.helpText}
              </Text>
            )}
          </View>
          {!props.alignActionsOnEnd && (
            <Fragment>
              {props.tryAgain && <Button {...tryAgainButtonProps} />}
              {props.goBackButtonVisible && (
                <Button
                  onPress={props.goBack}
                  width={Dimensions.get('screen').width * 0.54}
                  title={t('goBack')}
                  type="clear"
                  testID="goBack"
                />
              )}
            </Fragment>
          )}
        </View>
        {props.alignActionsOnEnd && (
          <Column fill crossAlign="center" align="flex-end">
            <Row style={{marginHorizontal: 30}}>
              {props.tryAgain && (
                <Button styles={{borderRadius: 9}} {...tryAgainButtonProps} />
              )}
            </Row>
            <Row>
              <Button
                onPress={props.goBack}
                title={t('goBack')}
                type="clear"
                testID="goBack"
              />
            </Row>
          </Column>
        )}
      </Fragment>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.goBack();
        return true;
      };

      const disableBackHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => disableBackHandler.remove();
    }, []),
  );

  return props.isModal ? (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      style={{
        ...Theme.ModalStyles.modal,
        backgroundColor: Theme.Colors.whiteBackgroundColor,
      }}
      showClose={props.showClose}
      {...testIDProps(props.testID)}>
      <Column
        fill
        safe
        align={props.alignActionsOnEnd ? 'space-around' : 'space-evenly'}>
        {errorContent()}
      </Column>
    </Modal>
  ) : (
    <View
      style={{
        ...Theme.ModalStyles.modal,
        backgroundColor: Theme.Colors.whiteBackgroundColor,
      }}
      {...testIDProps(props.testID)}>
      <Column fill safe>
        {props.goBack && <Header testID="errorHeader" goBack={props.goBack} />}
        <Column fill safe align="space-evenly">
          {errorContent()}
        </Column>
      </Column>
    </View>
  );
};

Error.defaultProps = {
  isModal: false,
  goBackButtonVisible: false,
  alignActionsOnEnd: false,
  showClose: true,
  tryAgainButtonTranslationKey: 'tryAgain',
};

export interface ErrorProps {
  isModal?: boolean;
  isVisible: boolean;
  showClose?: boolean;
  alignActionsOnEnd?: boolean;
  title: string;
  message: string;
  helpText?: string;
  image: React.ReactElement;
  goBack?: () => void;
  goBackButtonVisible?: boolean;
  tryAgain: null | (() => void);
  tryAgainButtonTranslationKey?: string;
  testID: string;
  onDismiss?: () => void;
}
