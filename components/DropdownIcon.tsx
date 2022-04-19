import React from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Popable } from 'react-native-popable';
import { Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Row } from './ui';
import { Colors } from './ui/styleUtils';

export const DropdownIcon: React.FC<DropdownProps> = (props) => {
  //const [visible, setVisible] = useState(false);

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
          onPress={item.onPress}
          style={{ paddingTop: 8, paddingBottom: 8 }}>
          <Row>
            <Icon
              name={item.icon}
              color={Colors.Orange}
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
        <Icon name={props.icon} color={Colors.Orange} size={24} />
      </Popable>
    </View>
  );
};
// interface item {
//   label: string;
//   onSelect: () => void;
// }

interface DropdownProps {
  icon: string;
  items?: any;
}
