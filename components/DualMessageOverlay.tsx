import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet} from 'react-native';
import {Overlay} from 'react-native-elements';
import {Column, Row, Text} from './ui';
import {Button} from './ui/Button';
import {Theme} from './ui/styleUtils';

/**
 * DualMessageOverlay is like MessageOverlay but with two buttons
 *
 * NOTE: This has been added for surfacing bugs and needs to be refactored
 * before use.
 */
export const DualMessageOverlay: React.FC<DualMessageOverlayProps> = props => {
  const {t} = useTranslation('common');
  const style = StyleSheet.create({
    customHeight: {
      height: props.customHeight
        ? props.customHeight
        : props.progress
        ? 100
        : 150,
    },
  });

  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={Theme.MessageOverlayStyles.overlay}
      onShow={props.onShow}
      onBackdropPress={props.onBackdropPress}>
      <Column
        width={Dimensions.get('screen').width * 0.8}
        style={[Theme.MessageOverlayStyles.popupOverLay, style.customHeight]}>
        <Column padding="21" crossAlign="center">
          {props.title && (
            <Text
              align="center"
              weight="bold"
              margin="0 0 10 0"
              color={Theme.Colors.Details}>
              {props.title}
            </Text>
          )}
          {props.message && (
            <Text
              align="center"
              weight="semibold"
              size="small"
              margin="10 0 0 0"
              color={Theme.Colors.Details}>
              {props.message}
            </Text>
          )}
          {props.hint && (
            <Text
              size="smaller"
              color={Theme.Colors.textLabel}
              margin={[2, 0, 0, 0]}>
              {props.hint}
            </Text>
          )}
          {props.children}
        </Column>
        <Column style={{marginBottom: 10}}>
          <Row style={Theme.MessageOverlayStyles.buttonContainer}>
            {!props.children && props.onTryAgain ? (
              <Button
                testID="tryAgain"
                title={t('tryAgain')}
                type="gradient"
                onPress={props.onTryAgain}
                styles={{
                  ...Theme.MessageOverlayStyles.halfButton,
                  ...Theme.ButtonStyles.gradient,
                  width: Dimensions.get('screen').width * 0.36,
                }}
              />
            ) : null}
            {!props.children && props.onIgnore ? (
              <Button
                testID="ignore"
                type="gradient"
                title={t('ignore')}
                onPress={props.onIgnore}
                styles={{
                  ...Theme.MessageOverlayStyles.halfButton,
                  ...Theme.ButtonStyles.gradient,
                  width: Dimensions.get('screen').width * 0.36,
                }}
              />
            ) : null}
          </Row>
        </Column>
      </Column>
    </Overlay>
  );
};

export interface DualMessageOverlayProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  progress?: boolean | number;
  requester?: boolean;
  hint?: string;
  onIgnore?: () => void;
  onBackdropPress?: () => void;
  onShow?: () => void;
  onTryAgain?: () => void;
  customHeight?: number | string | undefined;
}
