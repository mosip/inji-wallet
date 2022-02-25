import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { ListItem, Overlay, Input } from 'react-native-elements';
import { Text, Column, Row, Button } from './ui';
import { Colors } from './ui/styleUtils';

export const EditableListItem: React.FC<EditableListItemProps> = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(props.value);

  return (
    <ListItem bottomDivider onPress={() => setIsEditing(true)}>
      <ListItem.Content>
        <ListItem.Title>
          <Text>{props.label}</Text>
        </ListItem.Title>
      </ListItem.Content>
      <Text color={Colors.Grey}>{props.value}</Text>
      <Overlay
        overlayStyle={{ padding: 24, elevation: 6 }}
        isVisible={isEditing}
        onBackdropPress={dismiss}>
        <Column width={Dimensions.get('screen').width * 0.8}>
          <Text>Edit {props.label}</Text>
          <Input autoFocus value={newValue} onChangeText={setNewValue} />
          <Row>
            <Button
              fill
              type="clear"
              title="Cancel"
              onPress={() => setIsEditing(false)}
            />
            <Button fill title="Save" onPress={edit} />
          </Row>
        </Column>
      </Overlay>
    </ListItem>
  );

  function edit() {
    props.onEdit(newValue);
    dismiss();
  }

  function dismiss() {
    setNewValue('');
    setIsEditing(false);
  }
};

interface EditableListItemProps {
  label: string;
  value: string;
  onEdit: (newValue: string) => void;
}
