import React, { useState } from 'react';
import { View } from 'react-native';
// import { Picker } from '@react-native-community/picker';
// import { ItemValue } from '@react-native-community/picker/typings/Picker';
import { Icon } from 'react-native-elements';
import { Colors } from './ui/styleUtils';

const DEFAULT_LANGUAGE = 'en';

export function LanguageSelector() {
  // const [language, setLanguage] = useState<ItemValue>(DEFAULT_LANGUAGE);

  return (
    <View>
      <Icon name="language" color={Colors.Orange} />
      {/* <Picker
        mode="dropdown"
        selectedValue={language}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue: ItemValue) => setLanguage(itemValue)}>
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Tagalog" value="tl" />
      </Picker> */}
    </View>
  );
}
