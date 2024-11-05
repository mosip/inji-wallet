import React, {useEffect, useState} from 'react';
import {Dimensions, I18nManager} from 'react-native';
import {Icon, ListItem, Overlay, Input} from 'react-native-elements';
import {Text, Column, Row, Button} from './ui';
import {Theme} from './ui/styleUtils';
import {useTranslation} from 'react-i18next';
import testIDProps from '../shared/commonUtil';
import { SvgImage } from './ui/svg';

export const EditableListItem: React.FC<EditableListItemProps> = props => {
  const {t} = useTranslation('common');
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(props.items);
  const [overlayOpened, setOverlayOpened] = useState(true);

  useEffect(() => {
    if (props.response === 'success') {
      closePopup();
    }
  }, [props.response]);

  function updateItems(label: string, value: string) {
    const updatedItems = items.map(item => {
      if (item.label === label) {
        return {...item, value: value};
      }
      return item;
    });
    setItems(updatedItems);
  }

  return (
    <ListItem
      {...testIDProps(props.testID)}
      bottomDivider
      topDivider
      onPress={() => setIsEditing(true)}>
      {SvgImage.starIcon()}
      <ListItem.Content>
        <ListItem.Title
          {...testIDProps(props.testID + 'Title')}
          style={{paddingTop: 3}}>
          <Text weight="semibold" color={props.titleColor}>
            {props.title}
          </Text>
        </ListItem.Title>
        <Text color={Theme.Colors.textLabel}>{props.content}</Text>
      </ListItem.Content>
      <Icon
        name="chevron-right"
        size={21}
        color={Theme.Colors.chevronRightColor}
      />
      <Overlay
        overlayStyle={{padding: 24, elevation: 6}}
        isVisible={isEditing}
        onBackdropPress={dismiss}>
        <Column width={Dimensions.get('screen').width * 0.8}>
          {props.items.map((item: ListItemProps, index) => {
            return (
              <React.Fragment key={index}>
                <Text testID={item.testID + 'Label'}>
                  {t('editLabel', {label: item.label})}
                </Text>
                <Input
                  {...testIDProps(item.testID + 'InputField')}
                  autoFocus
                  value={items[index].value}
                  onChangeText={value => updateItems(item.label, value)}
                  selectionColor={Theme.Colors.Cursor}
                  inputStyle={{
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                />
                {index === 0 && props.response === 'error' && (
                  <Text
                    testID={item.testID + 'ErrorMessage'}
                    style={Theme.TextStyles.error}>
                    {props.errorMessage}
                  </Text>
                )}
              </React.Fragment>
            );
          })}
          {props.response === 'success' && overlayOpened && closePopup()}
          <Row>
            <Button
              testID="cancel"
              fill
              type="clear"
              title={t('cancel')}
              onPress={dismiss}
            />
            <Button
              testID="save"
              fill
              type='gradient'
              title={t('save')}
              onPress={edit}
              loading={props.progress}
            />
          </Row>
        </Column>
      </Overlay>
    </ListItem>
  );

  function edit() {
    props.onEdit(items);
    if (props.response === undefined) {
      setIsEditing(false);
    }
  }

  function dismiss() {
    setIsEditing(false);
    setItems(props.items);
    props.onCancel();
  }

  function closePopup() {
    setIsEditing(false);
    setOverlayOpened(false);
  }
};

interface EditableListItemProps {
  testID?: string;
  title: string;
  content: string;
  items: ListItemProps[];
  Icon: string;
  IconType?: string;
  onEdit: (values: ListItemProps[]) => void;
  display?: 'none' | 'flex';
  response?: string;
  onCancel: () => void;
  progress?: boolean;
  errorMessage?: string;
  titleColor: string;
}

interface ListItemProps {
  label: string;
  value: string;
  testID: string;
}
