import React, { useRef } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Popable } from 'react-native-popable';
import { Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Row } from './ui';
import { Colors, Theme } from './ui/styleUtils';

export const DropdownIcon: React.FC<DropdownProps> = (props) => {
  const popover = useRef(null);

  const handleOnPress = (item: Item) => {
    popover.current?.hide();
    item.onPress();
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          padding: 8,
          paddingTop: 4,
          paddingBottom: 4,
          borderBottomColor: Colors.Grey6,
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

  return (
    <View>
      <Popable
        position="bottom"
        ref={popover}
        backgroundColor={Colors.White}
        style={{ top: 10, left: -20, minWidth: 120, elevation: 1 }}
        content={
          <View>
            <FlatList
              data={props.items}
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
  label: string;
  onPress?: () => void;
}

interface DropdownProps {
  icon: string;
  items: Item[];
}
