import React, { useEffect, useState } from 'react';
import { Dimensions, I18nManager } from 'react-native';
import { Icon, ListItem, Overlay, Input } from 'react-native-elements';
import { Text, Column, Row, Button } from './ui';
import { Theme } from './ui/styleUtils';
import { useTranslation } from 'react-i18next';

export const EditableListItem: React.FC<EditableListItemProps> = (props) => {
  const { t } = useTranslation('common');
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(props.value);
  const [overlayOpened, setOverlayOpened] = useState(true);

  useEffect(() => {
    if (props.credentialRegistryResponse === 'success') {
      closePopup();
    }
  }, [props.credentialRegistryResponse]);

  return (
    <ListItem
      bottomDivider
      onPress={() => setIsEditing(true)}
      style={{ display: props.display }}>
      <Icon
        name={props.Icon}
        type="antdesign"
        size={20}
        style={Theme.Styles.profileIconBg}
        color={Theme.Colors.Icon}
      />
      <ListItem.Content>
        <ListItem.Title>
          <Text color={Theme.Colors.profileLabel}>{props.label}</Text>
        </ListItem.Title>
        <Text color={Theme.Colors.profileValue}>{props.value}</Text>
      </ListItem.Content>

      <Overlay
        overlayStyle={{ padding: 24, elevation: 6 }}
        isVisible={isEditing}
        onBackdropPress={dismiss}>
        <Column width={Dimensions.get('screen').width * 0.8}>
          <Text>{t('editLabel', { label: props.label })}</Text>
          <Input
            autoFocus
            value={newValue}
            onChangeText={setNewValue}
            selectionColor={Theme.Colors.Cursor}
            inputStyle={{
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
          />
          {props.credentialRegistryResponse === 'error' && (
            <Text style={Theme.Styles.warningText}>
              please try again after sometime...
            </Text>
          )}
          {props.credentialRegistryResponse === 'success' &&
            overlayOpened &&
            closePopup()}
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
    if (props.credentialRegistryResponse === undefined) {
      setIsEditing(false);
    }
  }

  function dismiss() {
    setNewValue(props.value);
    setIsEditing(false);
    props.credentialRegistryResponse = '';
  }

  function closePopup() {
    setIsEditing(false);
    setOverlayOpened(false);
  }
};

interface EditableListItemProps {
  label: string;
  value: string;
  Icon: string;
  onEdit: (newValue: string) => void;
  display?: 'none' | 'flex';
  credentialRegistryResponse: string;
}
