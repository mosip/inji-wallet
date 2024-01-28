import React from 'react';
import {View} from 'react-native';
import {Row, Text} from './ui';
import {Theme} from './ui/styleUtils';
import {Icon} from 'react-native-elements';
import testIDProps from '../shared/commonUtil';

export const BannerNotification: React.FC<BannerNotificationProps> = props => {
  return (
    <View {...testIDProps(props.testId)} style={props.customStyle}>
      <Row style={!props.isBackup && Theme.Styles.downloadingVcPopUp}>
        <Text color={Theme.Colors.whiteText} weight="semibold" size="smaller">
          {props.message}
        </Text>
        <Icon
          testID="close"
          name="close"
          onPress={props.onClosePress}
          color={Theme.Colors.whiteText}
          size={19}
        />
      </Row>
    </View>
  );
};

BannerNotification.defaultProps = {
  customStyle: {},
};

export interface BannerNotificationProps {
  isBackup?: boolean;
  message: string;
  onClosePress: () => void;
  testId: string;
  customStyle?: Object;
}
