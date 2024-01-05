import {Column, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import React from 'react';
import {setTextColor} from './VCUtils';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {Tooltip} from 'react-native-elements';

export const VCItemField = ({
  verifiableCredential,
  fieldName,
  fieldValue,
  wellknown,
}) => {
  if (!verifiableCredential) {
    return (
      <Column margin="9 0 0 0">
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={150}
          style={{marginBottom: 5, borderRadius: 5}}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={180}
          style={{borderRadius: 5}}
        />
      </Column>
    );
  }

  return (
    <Column margin="9 0 0 0">
      <Text
        testID={`${fieldName}Title`}
        weight="regular"
        size="smaller"
        {...setTextColor(wellknown)}
        style={[Theme.Styles.subtitle]}>
        {fieldName}
      </Text>
      <Tooltip
        toggleOnPress={true}
        containerStyle={{
          width: 200,
          height: null,
          overflow: 'hidden',
        }}
        skipAndroidStatusBar={true}
        backgroundColor={Theme.Colors.Icon}
        popover={<Text>{fieldValue}</Text>}>
        <Text
          testID={`${fieldName}Value`}
          weight="semibold"
          numLines={1}
          ellipsizeMode={'tail'}
          style={[Theme.Styles.subtitle, setTextColor(wellknown)]}>
          {fieldValue}
        </Text>
      </Tooltip>
    </Column>
  );
};
