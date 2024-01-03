import React from 'react';
import {TextInput} from 'react-native';
import {Icon} from 'react-native-elements';
import {Row} from './Layout';
import {Theme} from './styleUtils';

export const SearchBar = (props: SearchBarProps) => {
  return (
    <Row>
      <Icon
        testID={props.searchIconTestID}
        name="search"
        color={Theme.Colors.Icon}
        size={27}
        style={Theme.SearchBarStyles.searchIcon}
      />
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
