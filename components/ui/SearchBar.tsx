import React from 'react';
import {TextInput, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {Row} from './Layout';
import {Theme} from './styleUtils';
import {SvgImage} from './svg';

export const SearchBar = (props: SearchBarProps) => {
  return (
    <Row>
      {props.isVcSearch ? (
        <View
          testID={props.searchIconTestID}
          style={Theme.SearchBarStyles.vcSearchIcon}>
          {SvgImage.SearchIcon()}
        </View>
      ) : (
        <Icon
          testID={props.searchIconTestID}
          name="search"
          color={Theme.Colors.Icon}
          size={27}
          style={Theme.SearchBarStyles.searchIcon}
        />
      )}
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

SearchBar.defaultProps = {
  isVcSearch: false,
};

interface SearchBarProps {
  isVcSearch: Boolean;
  searchIconTestID: string;
  searchBarTestID: string;
  search: string;
  placeholder: string;
  onFocus: () => void;
  onChangeText: (searchText: string) => void;
  onLayout: () => void;
}
