import React from 'react';
import { Dimensions, Modal as RNModal, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Column, Row, Text } from '.';
import { Theme, ElevationLevel } from './styleUtils';

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
      onRequestClose={props.onDismiss}>
      <Column fill>
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
}
