import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { Icon, ListItem, Overlay, Input } from 'react-native-elements';
import { Text, Column, Row, Button } from './ui';
import { Theme } from './ui/styleUtils';
import { useTranslation } from 'react-i18next';

export const EditableListItem: React.FC<EditableListItemProps> = (props) => {
  const { t } = useTranslation('common');
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(props.value);

  return (
    <ListItem bottomDivider onPress={() => setIsEditing(true)}>
      <Icon
        name={props.Icon}
        type={props.IconType}
        size={22}
        color={Theme.Colors.Icon}
      />
      <ListItem.Content>
        <ListItem.Title>
          <Text weight="semibold" color={Theme.Colors.profileLabel}>
            {props.label}
          </Text>
        </ListItem.Title>
      </ListItem.Content>
      <Icon
        name="chevron-right"
        size={21}
        color={Theme.Colors.profileLanguageValue}
      />
      <Overlay
        overlayStyle={{ padding: 24, elevation: 6 }}
        isVisible={isEditing}
        onBackdropPress={dismiss}>
        <Column width={Dimensions.get('screen').width * 0.8}>
          <Text>{t('editLabel', { label: props.label })}</Text>
          <Input autoFocus value={newValue} onChangeText={setNewValue} />
          <Row>
            <Button fill type="clear" title={t('cancel')} onPress={dismiss} />
            <Button fill title={t('save')} onPress={edit} />
          </Row>
        </Column>
      </Overlay>
    </ListItem>
  );

  function edit() {
    props.onEdit(newValue);
    setIsEditing(false);
  }

  function dismiss() {
    setNewValue(props.value);
    setIsEditing(false);
  }
};

interface EditableListItemProps {
  label: string;
  value: string;
  Icon: string;
  IconType?: string;
  onEdit: (newValue: string) => void;
}
