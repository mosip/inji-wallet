import {Column, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import React from 'react';
import {setTextColor} from './VCUtils';
import {Tooltip} from 'react-native-elements';

export const VCItemFieldName = ({fieldName, wellknown}) => {
  return (
    <>
      {fieldName && (
        <Text
          testID={`${fieldName}Title`}
          weight="regular"
          size="smaller"
          {...setTextColor(wellknown)}
          style={[Theme.Styles.subtitle]}>
          {fieldName}
        </Text>
      )}
    </>
  );
};

export const VCItemFieldValue = ({fieldName, fieldValue, wellknown}) => {
  return (
    <Tooltip
      toggleOnPress={fieldValue.length > 20}
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
        style={[
          Theme.Styles.subtitle,
          setTextColor(wellknown),
          {marginTop: 5},
        ]}>
        {fieldValue}
      </Text>
    </Tooltip>
  );
};

export const VCItemField = props => {
  return (
    <Column margin="9 0 0 0">
      <VCItemFieldName {...props} />
      <VCItemFieldValue {...props} />
    </Column>
  );
};
