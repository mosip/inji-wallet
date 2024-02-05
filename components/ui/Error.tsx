import {useFocusEffect} from '@react-navigation/native';
import React, {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import {BackHandler, Dimensions, View, StyleSheet} from 'react-native';
import {Button, Column, Row, Text} from '.';
import {Header} from './Header';
import {Theme} from './styleUtils';
import testIDProps from '../../shared/commonUtil';
import {Modal} from './Modal';
import {ButtonProps as RNEButtonProps} from 'react-native-elements';

export const Error: React.FC<ErrorProps> = props => {
  const {t} = useTranslation('common');
  console.log('props::', props);
  const errorContent = () => {
    return (
      <Fragment>
        <View style={[{alignItems: 'center'}, props.customStyles]}>
          <View>
            <Row align="center" style={Theme.ErrorStyles.image}>
              {props.image}
            </Row>
            <Text
              style={Theme.ErrorStyles.title}
              testID={`${props.testID}Title`}>
              {props.title}
            </Text>
            <Text
              style={Theme.ErrorStyles.message}
              testID={`${props.testID}Message`}>
              {props.message}
            </Text>
            {props.helpText && (
              <Text
                style={Theme.ErrorStyles.message}
                testID={`${props.testID}HelpText`}>
                {props.helpText}
              </Text>
            )}
          </View>
          {!props.alignActionsOnEnd && (
            <Fragment>
              {props.primaryButtonText && (
                <Button
                  onPress={props.primaryButtonEvent}
                  title={t(props.primaryButtonText)}
                  type={
                    props.primaryButtonText === 'tryAgain'
                      ? 'outline'
                      : 'gradient'
                  }
                  width={
                    props.primaryButtonText === 'tryAgain'
                      ? Dimensions.get('screen').width * 0.54
                      : undefined
                  }
                  testID={props.primaryButtonTestID}
                />
              )}
              {props.textButtonText && (
                <Button
                  onPress={props.textButtonEvent}
                  width={Dimensions.get('screen').width * 0.54}
                  title={t(props.textButtonText)}
                  type="clear"
                  testID={props.textButtonTestID}
                />
              )}
            </Fragment>
          )}
        </View>
        {props.alignActionsOnEnd && (
          <Column fill crossAlign="center" align="flex-end" margin="0 0 16">
            <Row style={{marginHorizontal: 30}}>
              {props.primaryButtonText && (
                <Button
                  styles={{borderRadius: 9}}
                  onPress={props.primaryButtonEvent}
                  title={t(props.primaryButtonText)}
                  type="gradient"
                  testID={props.primaryButtonTestID}
                />
              )}
            </Row>
            <Row>
              {props.textButtonText && (
                <Button
                  onPress={props.textButtonEvent}
                  title={t(props.textButtonText)}
                  type="clear"
                  testID={props.textButtonTestID}
                />
              )}
            </Row>
          </Column>
        )}
      </Fragment>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.textButtonEvent;
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
      showClose={props.showClose}
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
  goBackType: 'clear',
};

export interface ErrorProps {
  testID: string;
  customStyles?: {};
  goBackType?: RNEButtonProps['type'] | 'gradient';
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
  tryAgain?: null | (() => void);
  onDismiss?: () => void;
  primaryButtonText?: string;
  primaryButtonEvent?: () => void;
  testIDTextButton?: string | null;
  textButtonText?: string;
  textButtonEvent?: () => void;
  primaryButtonTestID?: string;
  textButtonTestID?: string;
}
