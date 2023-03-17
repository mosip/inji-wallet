import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Input } from 'react-native-elements';
import { Button, Centered, Column, Row, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { useTranslation } from 'react-i18next';

export const TextEditOverlay: React.FC<EditOverlayProps> = (props) => {
  const { t } = useTranslation('common');
  const [value, setValue] = useState(props.value);

  return (
    <View style={Theme.TextEditOverlayStyles.viewContainer}>
      <Centered fill>
        <Column
          width={Dimensions.get('screen').width * 0.8}
          style={Theme.TextEditOverlayStyles.boxContainer}>
          <Text weight="semibold" margin="0 0 16 0">
            {props.label}
          </Text>
          <Input
            autoFocus
            value={value}
            selectionColor={Theme.Colors.Cursor}
            onChangeText={setValue}
          />
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
