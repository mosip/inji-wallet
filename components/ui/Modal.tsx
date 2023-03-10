import React from 'react';
import { I18nManager, Modal as RNModal, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Centered, Column, Row, Text } from '.';
import { ElevationLevel, Theme } from './styleUtils';

export const Modal: React.FC<ModalProps> = (props) => {
  return (
    <RNModal
      animationType="slide"
      style={Theme.ModalStyles.modal}
      visible={props.isVisible}
      onShow={props.onShow}
      onRequestClose={props.onDismiss}>
      <Column fill safe align="center">
        <Row elevation={props.headerElevation}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 21,
              marginVertical: 16,
            }}>
            {props.headerRight ? (
              <Icon
                name={I18nManager.isRTL ? 'chevron-right' : 'chevron-left'}
                onPress={props.onDismiss}
                color={Theme.Colors.Icon}
              />
            ) : null}
            {props.arrowLeft ? (
              <Icon
                name="arrow-left"
                type="material-community"
                onPress={props.onDismiss}
                color={Theme.Colors.Details}
              />
            ) : null}
            <Centered fill align="center">
              <Text weight="semibold">{props.headerTitle}</Text>
            </Centered>
            {props.headerRight || props.arrowLeft || (
              <Icon
                name="close"
                onPress={props.onDismiss}
                color={Theme.Colors.Icon}
              />
            )}
          </View>
        </Row>
        {props.children}
      </Column>
    </RNModal>
  );
};

export interface ModalProps {
  isVisible: boolean;
  onDismiss: () => void;
  headerTitle?: string;
  headerElevation?: ElevationLevel;
  headerRight?: React.ReactElement;
  arrowLeft?: React.ReactElement;
  onShow?: () => void;
}
