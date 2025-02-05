import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import {Overlay} from 'react-native-elements';
import {Button, Column, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';

export const VPShareOverlay: React.FC<VPShareOverlayProps> = props => {
  const {t} = useTranslation('SendVPScreen');

  return (
    <Overlay
      isVisible={props.isVisible}
      onBackdropPress={props.onCancel}
      overlayStyle={Theme.BindingVcWarningOverlay.overlay}>
      <Column
        align="space-between"
        crossAlign="center"
        padding={'10'}
        width={Dimensions.get('screen').width * 0.8}
        height={Dimensions.get('screen').height * 0}>
        <Column crossAlign="center" margin="10 0 15 0" padding="0">
          <Text
            testID={props.titleTestID}
            weight="bold"
            size="large"
            color="#000000"
            style={{padding: 3}}>
            {props.title}
          </Text>

          <Text
            testID={props.messageTestID}
            align="center"
            size="mediumSmall"
            weight="regular"
            margin="10 0 0 0"
            color="#5D5D5D">
            {props.message}
          </Text>
        </Column>

        <Button
          testID={props.primaryButtonTestID}
          margin={'10 0 0 0'}
          type="gradient"
          title={props.primaryButtonText}
          onPress={() => props.primaryButtonEvent()}
        />
        <Button
          testID={props.secondaryButtonTestID}
          margin={'10 0 0 0'}
          type="clear"
          title={props.secondaryButtonText}
          onPress={() => props.secondaryButtonEvent()}
        />
      </Column>
    </Overlay>
  );
};

export interface VPShareOverlayProps {
  isVisible: boolean;
  title: string;
  titleTestID: string;
  message: string;
  messageTestID: string;
  primaryButtonTestID: string;
  primaryButtonText: string;
  primaryButtonEvent: () => void;
  secondaryButtonTestID: string;
  secondaryButtonText: string;
  secondaryButtonEvent: () => void;
  onCancel: () => void;
}
