import React, { Fragment } from 'react';
import { View } from 'react-native';
import Spinner from 'react-native-spinkit';
import { Theme } from './styleUtils';
import testIDProps from '../../shared/commonUtil';
import { SvgImage } from './svg';

export const LoaderAnimation: React.FC = () => {
  return (
    <Fragment>
      {SvgImage.ProgressIcon()}
      <View {...testIDProps('threeDotsLoader')}>
        <Spinner
          type="ThreeBounce"
          color={Theme.Colors.Loading}
          style={{ marginLeft: 6 }} />
      </View>
    </Fragment>
  );
};
