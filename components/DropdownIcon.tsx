import React, { useRef } from 'react';
import {
  FlatList,
  I18nManager,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Popable } from 'react-native-popable';
import { Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Row } from './ui';
import { Theme } from './ui/styleUtils';

export const DropdownIcon: React.FC<DropdownProps> = (props) => {
  const popover = useRef(null);

  const handleOnPress = (item: Item) => {
    popover.current?.hide();
    item.onPress();
  };

  const filteredItems = (idType: string, items: Item[]) => {
    return items.filter((item) => !item.idType || item.idType === idType);
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          padding: 8,
          paddingTop: 4,
          paddingBottom: 4,
          borderBottomColor: Theme.Colors.borderBottomColor,
          borderBottomWidth: 1,
        }}>
        <Pressable
          onPress={() => handleOnPress(item)}
          style={{ paddingTop: 8, paddingBottom: 8 }}>
          <Row>
            <Icon
              name={item.icon}
              color={Theme.Colors.Icon}
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text>{item.label}</Text>
          </Row>
        </Pressable>
      </View>
    );
  };

  const styles = StyleSheet.create({
    popoverStyle: {
      top: 10,
      right: I18nManager.isRTL ? 20 : 'auto',
      left: I18nManager.isRTL ? 'auto' : -20,
      minWidth: 120,
      elevation: 1,
    },
  });

  return (
    <View>
      <Popable
        position="bottom"
        ref={popover}
        backgroundColor={Theme.Colors.whiteBackgroundColor}
        style={styles.popoverStyle}
        content={
          <View>
            <FlatList
              data={filteredItems(props.idType, props.items)}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        }>
        <Icon name={props.icon} color={Theme.Colors.Icon} size={24} />
      </Popable>
    </View>
  );
};
interface Item {
  idType?: string;
  label: string;
  onPress?: () => void;
}

interface DropdownProps {
  idType: string;
  icon: string;
  items: Item[];
}
