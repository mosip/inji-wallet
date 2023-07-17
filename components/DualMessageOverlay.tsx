import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Column, Row, Text } from './ui';
import { Button } from './ui/Button';
import { Theme } from './ui/styleUtils';

/**
 * DualMessageOverlay is like MessageOverlay but with two buttons
 *
 * NOTE: This has been added for surfacing bugs and needs to be refactored
 * before use.
 */
export const DualMessageOverlay: React.FC<DualMessageOverlayProps> = (
  props
) => {
  const { t } = useTranslation('common');
  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={Theme.MessageOverlayStyles.overlay}
      onShow={props.onShow}
      onBackdropPress={props.onBackdropPress}>
      <Column
        width={Dimensions.get('screen').width * 0.8}
        style={
          !props.progress
            ? Theme.MessageOverlayStyles.popupOverLay
            : { height: 230 }
        }>
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
              margin={[4, 0, 0, 0]}>
              {props.hint}
            </Text>
          )}
          {props.children}
        </Column>
        <Row>
          {!props.children && props.onTryAgain ? (
            <Button
              title={t('tryAgain')}
              type="solid"
              onPress={props.onTryAgain}
              styles={{ ...Theme.MessageOverlayStyles.halfButton }}
            />
          ) : null}
          <View style={{ margin: '1.4%' }} />
          {!props.children && props.onIgnore ? (
            <Button
              type="solid"
              title={t('ignore')}
              onPress={props.onIgnore}
              styles={{ ...Theme.MessageOverlayStyles.halfButton }}
            />
          ) : null}
        </Row>
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
}
