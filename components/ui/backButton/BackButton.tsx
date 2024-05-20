import React from 'react';
import {I18nManager, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import testIDProps from '../../../shared/commonUtil';
import {Theme} from '../styleUtils';

export const BackButton: React.FC<BackButtonProps> = (
  props: BackButtonProps,
) => {
  let containerStyle: object = Theme.Styles.backArrowContainer;
  if (props.customIconStyle)
    containerStyle = {...containerStyle, ...props.customIconStyle};
  return (
    <TouchableOpacity
      onPress={props.onPress}
      {...testIDProps('goBack')}
      style={{zIndex: 1}}>
      <Icon
        {...testIDProps('arrow-left')}
        name={I18nManager.isRTL ? 'arrow-right' : 'arrow-left'}
        type="material-community"
        onPress={props.onPress}
        containerStyle={containerStyle}
        color={Theme.Colors.Icon}
      />
    </TouchableOpacity>
  );
};

interface BackButtonProps {
  onPress: () => void;
  customIconStyle?: object;
}
