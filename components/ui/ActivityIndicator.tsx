import {Centered, Column} from './Layout';
import {View} from 'react-native';
import {Theme} from './styleUtils';
import testIDProps from '../../shared/commonUtil';
import Spinner from 'react-native-spinkit';
import React from 'react';
import {SvgImage} from './svg';

export const ActivityIndicator = () => {
  return (
    <Centered
      style={{backgroundColor: Theme.Colors.whiteBackgroundColor}}
      crossAlign="center"
      fill>
      <Column
        style={{
          flex: 1,
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
        }}
        margin="24 0"
        align="center"
        crossAlign="center">
        {SvgImage.ProgressIcon()}
        <View {...testIDProps('threeDotsLoader')}>
          <Spinner
            type="ThreeBounce"
            color={Theme.Colors.Loading}
            style={{marginLeft: 6}}
          />
        </View>
      </Column>
    </Centered>
  );
};
