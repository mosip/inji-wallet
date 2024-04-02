import {Tooltip} from 'react-native-elements';
import {View} from 'react-native';
import {Centered, Column} from './Layout';
import {Text} from './Text';
import React from 'react';
import {Theme} from './styleUtils';
import testIDProps from '../../shared/commonUtil';
import {StyleProp} from 'react-native';
import {ViewStyle} from 'react-native';

export const CustomTooltip: React.FC<CustomTooltipProps> = props => {
  const tooltipContent = (
    <Column>
      <Text weight="semibold">{props.title}</Text>
      <View style={Theme.Styles.tooltipHrLine}></View>
      <Text weight="regular" style={Theme.Styles.tooltipContentDescription}>
        {props.description}
      </Text>
    </Column>
  );
  return (
    <Tooltip
      {...testIDProps(props.testID)}
      popover={props.toolTipContent}
      width={props.width}
      height={props.height}
      withPointer={true}
      withOverlay={false}
      skipAndroidStatusBar={true}
      pointerColor={Theme.Colors.toolTipPointerColor}
      containerStyle={Theme.Styles.tooltipContainerStyle}>
      <Centered style={props.triggerComponentStyles} fill>
        {props.triggerComponent}
      </Centered>
    </Tooltip>
  );
};

interface CustomTooltipProps {
  title: string;
  description: string;
  width: number;
  height: number;
  triggerComponent: React.ReactElement;
  triggerComponentStyles: StyleProp<ViewStyle>;
  testID: string;
  toolTipContent?: React.ReactElement;
}
