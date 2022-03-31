import React, { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Overlay, Input } from 'react-native-elements';
import { Button, Column, Row, Text } from './ui';
import { Colors, elevation } from './ui/styleUtils';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  overlay: {
    ...elevation(5),
    backgroundColor: Colors.White,
    padding: 0,
  },
});

export const TextEditOverlay: React.FC<EditOverlayProps> = (props) => {
  const { t } = useTranslation('common');
  const [value, setValue] = useState(props.value);

  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={styles.overlay}
      onBackdropPress={props.onDismiss}>
      <Column pX={24} pY={24} width={Dimensions.get('screen').width * 0.8}>
        <Text weight="semibold" margin="0 0 16 0">
          {props.label}
        </Text>
        <Input autoFocus value={value} onChangeText={setValue} />
        <Row>
          <Button
            fill
            type="clear"
            title={t('cancel')}
            onPress={dismiss}
            margin="0 8 0 0"
          />
          <Button fill title={t('save')} onPress={() => props.onSave(value)} />
        </Row>
      </Column>
    </Overlay>
  );

  function dismiss() {
    setValue(props.value);
    props.onDismiss();
  }
};

interface EditOverlayProps {
  isVisible: boolean;
  label: string;
  value: string;
  onSave: (value: string) => void;
  onDismiss: () => void;
}
