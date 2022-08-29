import React from 'react';
import { Dimensions, Modal as RNModal, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Column, Row, Text } from '.';
import { Colors, ElevationLevel } from './styleUtils';

const styles = StyleSheet.create({
  modal: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
});

export const Modal: React.FC<ModalProps> = (props) => {
  return (
    <RNModal
      animationType="slide"
      style={styles.modal}
      visible={props.isVisible}
      onShow={props.onShow}
      onRequestClose={props.onDismiss}>
      <Column fill>
        <Row padding="16 32" elevation={props.headerElevation}>
          {props.headerRight ? (
            <Icon
              name="chevron-left"
              onPress={props.onDismiss}
              color={Colors.Orange}
            />
          ) : null}

          <Row fill align="center">
            <Text weight="semibold">{props.headerTitle}</Text>
          </Row>
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
