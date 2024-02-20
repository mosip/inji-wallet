import React from 'react';
import {Pressable} from 'react-native';
import {Column, Row, Text} from './ui';
import {Theme} from './ui/styleUtils';
import {Icon} from 'react-native-elements';
import testIDProps from '../shared/commonUtil';
import {BANNER_TYPE_SUCCESS, BANNER_TYPE_ERROR} from '../shared/constants';

export const BannerNotification: React.FC<BannerNotificationProps> = props => {
  return (
    <Row
      {...testIDProps(props.testId)}
      style={[Theme.BannerStyles.container, Theme.BannerStyles[props.type]]}>
      <Column fill>
        <Text
          color={Theme.Colors.whiteText}
          weight="semibold"
          style={Theme.BannerStyles.text}>
          {props.message}
        </Text>
      </Column>
      <Column>
        <Pressable
          style={Theme.BannerStyles.dismiss}
          {...testIDProps('close')}
          onPress={props.onClosePress}>
          <Icon name="close" color={Theme.Colors.whiteText} size={19} />
        </Pressable>
      </Column>
    </Row>
  );
};

export interface BannerNotificationProps {
  message: string;
  onClosePress: () => void;
  testId: string;
  type: typeof BANNER_TYPE_SUCCESS | typeof BANNER_TYPE_ERROR;
}
