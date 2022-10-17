import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Input } from 'react-native-elements';
import { Button, Centered, Column, Row, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  overlay: {
    ...Theme.elevation(5),
    backgroundColor: Theme.Colors.overlayBackgroundColor,
    padding: 0,
  },
  viewContainer: {
    backgroundColor: 'rgba(0,0,0,.6)',
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    position: 'absolute',
    top: 0,
    zIndex: 9,
  },
  boxContainer: {
    backgroundColor: Theme.Colors.whiteBackgroundColor,
    padding: 24,
    elevation: 6,
    borderRadius: 4,
  },
});

export const TextEditOverlay: React.FC<EditOverlayProps> = (props) => {
  const { t } = useTranslation('common');
  const [value, setValue] = useState(props.value);

  return (
    <View style={styles.viewContainer}>
      <Centered fill>
        <Column
          width={Dimensions.get('screen').width * 0.8}
          style={styles.boxContainer}>
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
            <Button
              fill
              title={t('save')}
              onPress={() => props.onSave(value)}
            />
          </Row>
        </Column>
      </Centered>
    </View>
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
