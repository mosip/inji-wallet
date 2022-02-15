import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';
import { Button, Column, Row, Text } from '../../components/ui';
import { Colors, elevation } from '../../components/ui/styleUtils';
import { VidItem } from '../../components/VidItem';
import {
  SelectVidOverlayProps,
  useSelectVidOverlay,
} from './SelectVidOverlayController';

const styles = StyleSheet.create({
  overlay: {
    ...elevation(5),
    backgroundColor: Colors.White,
    padding: 0,
  },
});

export const SelectVidOverlay: React.FC<SelectVidOverlayProps> = (props) => {
  const controller = useSelectVidOverlay(props);

  return (
    <Overlay isVisible={props.isVisible} overlayStyle={styles.overlay}>
      <Column
        padding="24"
        width={Dimensions.get('screen').width * 0.9}
        style={{ maxHeight: Dimensions.get('screen').height * 0.9 }}>
        <Text weight="semibold" margin="0 0 16 0">
          Share {controller.vidLabel.singular}
        </Text>
        <Text margin="0 0 16 0">
          Choose the VID you'd like to share with{' '}
          <Text weight="semibold">{props.receiverName}</Text>
        </Text>
        <Column margin="0 0 32 0" scroll>
          {props.vidKeys.map((vidKey, index) => (
            <VidItem
              key={vidKey}
              vidKey={vidKey}
              margin="0 2 8 2"
              onPress={controller.selectVidItem(index)}
              selectable
              selected={index === controller.selectedIndex}
            />
          ))}
        </Column>
        <Row margin="16 0 0 0">
          <Button
            fill
            type="clear"
            title="Cancel"
            onPress={() => props.onCancel()}
            margin="0 8 0 0"
          />
          <Button
            fill
            title="Share"
            disabled={controller.selectedIndex == null}
            onPress={controller.onSelect}
          />
        </Row>
      </Column>
    </Overlay>
  );
};
