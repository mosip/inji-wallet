import React from 'react';
import {Dimensions, View} from 'react-native';
import {Centered, Column} from './Layout';
import {Theme} from './styleUtils';
import {Text} from './Text';
import testIDProps from '../../shared/commonUtil';
import {SvgImage} from '../../components/ui/svg';

export const SquircleIconPopUpModal: React.FC<
  SquircleIconPopUpModalProps
> = props => {
  return (
    <View
      {...testIDProps(props.testId)}
      style={Theme.MessageStyles.viewContainer}
      onTouchStart={props.onBackdropPress}>
      <Centered fill>
        <Column
          width={Dimensions.get('screen').width * 0.8}
          height={Dimensions.get('screen').width * 0.8}
          style={Theme.MessageStyles.squircleContainer}>
          <Column>
            {SvgImage.SuccessLogo()}
            {props.message && (
              <Text
                margin="25 0 0 0"
                weight={'semibold'}
                style={{fontSize: 17, textAlign: 'center'}}>
                {props.message}
              </Text>
            )}
          </Column>
        </Column>
      </Centered>
    </View>
  );
};

export interface SquircleIconPopUpModalProps {
  message: string;
  testId: string;
  onBackdropPress?: () => void;
}
