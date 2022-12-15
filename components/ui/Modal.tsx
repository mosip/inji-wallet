import React from 'react';
import { Modal as RNModal, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Column, Row, Text } from '.';
import { ElevationLevel, Theme } from './styleUtils';

export const Modal: React.FC<ModalProps> = (props) => {
  return (
    <RNModal
      animationType="slide"
      style={Theme.ModalStyles.modal}
      visible={props.isVisible}
      onShow={props.onShow}
      onRequestClose={props.onDismiss}>
      <Column fill safe>
        <Row elevation={props.headerElevation}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginHorizontal: 16,
              marginVertical: 16,
            }}>
            {props.headerRight ? (
              <Icon
                name="chevron-left"
                onPress={props.onDismiss}
                color={Theme.Colors.Icon}
              />
            ) : null}
            <Row fill align="center">
              <Text weight="semibold">{props.headerTitle}</Text>
            </Row>
            {props.headerRight || (
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
  onShow?: () => void;
}
