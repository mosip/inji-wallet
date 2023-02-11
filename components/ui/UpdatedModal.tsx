import React from 'react';
import { I18nManager, Modal as RNModal } from 'react-native';
import { Icon } from 'react-native-elements';
import { Column, Row } from '.';
import { Theme, ElevationLevel } from './styleUtils';

export const Modal: React.FC<ModalProps> = (props) => {
  return (
    <RNModal
      animationType="slide"
      style={Theme.UpdateModalStyles.modal}
      visible={props.isVisible}
      onRequestClose={props.onDismiss}>
      <Column fill>
        <Row padding="16 32" elevation={props.headerElevation}>
          {props.headerRight ? (
            <Icon
              name={I18nManager.isRTL ? 'chevron-right' : 'chevron-left'}
              onPress={props.onDismiss}
              color={Theme.Colors.Icon}
            />
          ) : null}
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
