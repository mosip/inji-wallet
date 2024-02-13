import React from 'react';
import {TextInput, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {Row} from './Layout';
import {Theme} from './styleUtils';
import {SvgImage} from './svg';
import {Svg} from 'react-native-svg';

export const SearchBar = (props: SearchBarProps) => {
  return (
    <Row>
      <View style={Theme.SearchBarStyles.searchIcon}>
        {SvgImage.SearchIcon()}
      </View>
      <TextInput
        testID={props.searchBarTestID}
        style={Theme.SearchBarStyles.searchBar}
        placeholder={props.placeholder}
        value={props.search}
        onFocus={props.onFocus}
        onChangeText={searchText => props.onChangeText(searchText)}
        onLayout={props.onLayout}
      />
    </Row>
  );
};

interface SearchBarProps {
  searchIconTestID: string;
  searchBarTestID: string;
  search: string;
  placeholder: string;
  onFocus: () => void;
  onChangeText: (searchText: string) => void;
  onLayout: () => void;
}
