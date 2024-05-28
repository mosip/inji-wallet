import React, {Fragment} from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-spinkit';
import {Theme} from './styleUtils';
import testIDProps from '../../shared/commonUtil';
import {SvgImage} from './svg';

export const LoaderAnimation: React.FC<LoaderAnimationProps> = ({
  showLogo,
  testID,
}) => {
  return (
    <Fragment>
      {showLogo && SvgImage.ProgressIcon()}
      <View {...testIDProps(`${testID}-threeDotsLoader`)}>
        <Spinner
          type="ThreeBounce"
          color={Theme.Colors.Loading}
          style={{marginLeft: 6}}
        />
      </View>
    </Fragment>
  );
};

LoaderAnimation.defaultProps = {
  showLogo: true,
};

interface LoaderAnimationProps {
  showLogo?: boolean;
  testID: string;
}
