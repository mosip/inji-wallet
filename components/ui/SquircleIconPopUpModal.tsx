import React from 'react';
import {Dimensions, Image, View} from 'react-native';
import {Centered, Column} from './Layout';
import {Theme} from './styleUtils';
import {Text} from './Text';
import testIDProps from '../../shared/commonUtil';

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
            {props.iconName && (
              <Image source={props.iconName} style={{alignSelf: 'center'}} />
            )}
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
  iconName: any;
  testId: string;
  onBackdropPress?: () => void;
}
