import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {BackHandler, Dimensions, View, StyleSheet} from 'react-native';
import {Button, Column, Row, Text} from '.';
import {Header} from './Header';
import {Theme} from './styleUtils';
import testIDProps from '../../shared/commonUtil';
import {Modal} from './Modal';

export const Error: React.FC<ErrorProps> = props => {
  const {t} = useTranslation('common');
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '50%',
      height: 200,
    },
  });
  const errorContent = () => {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Row align="center" style={Theme.ErrorStyles.image}>
            {props.image}
          </Row>
          <Text style={Theme.ErrorStyles.title} testID="errorTitle">
            {props.title}
          </Text>
          <Text style={Theme.ErrorStyles.message} testID="errorMessage">
            {props.message}
          </Text>
          {props.tryAgain && (
            <Button
              onPress={props.tryAgain}
              width={Dimensions.get('screen').width * 0.54}
              title={t('tryAgain')}
              type="outline"
              testID="tryAgain"
            />
          )}
        </View>
        {props.primaryButtonEvent && (
          <Button
            testID={props.testIDPrimaryButton ?? ''}
            type="gradient"
            margin="0 0 16"
            title={props.primaryButtonText ?? ''}
            onPress={props.primaryButtonEvent}
          />
        )}
        {props.textButtonEvent && (
          <Button
            testID={props.testIDTextButton ?? ''}
            type="clear"
            margin="0 0 16"
            title={props.textButtonText ?? ''}
            onPress={() => {
              props.textButtonEvent;
            }}
          />
        )}
      </View>
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
      showClose={props.showClose}
      onDismiss={props.onDismiss}
      style={{
        ...Theme.ModalStyles.modal,
        backgroundColor: Theme.Colors.whiteBackgroundColor,
      }}
      {...testIDProps(props.testID)}>
      <Column fill safe align="space-evenly">
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
};

export interface ErrorProps {
  isModal?: boolean;
  isVisible: boolean;
  showClose: boolean;
  title: string;
  message: string;
  image: React.ReactElement;
  testID: string;
  tryAgain?: null | (() => void);
  goBack?: () => void;
  onDismiss?: () => void;
  testIDPrimaryButton?: string | null;
  primaryButtonText?: string;
  primaryButtonEvent?: () => void;
  testIDTextButton?: string | null;
  textButtonText?: string | null;
  textButtonEvent?: () => void | null;
}
