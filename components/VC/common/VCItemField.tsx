import {Column, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import React from 'react';
import {setTextColor} from './VCUtils';

export const VCItemFieldName = ({fieldName, wellknown}) => {
  return (
    <>
      {fieldName && (
        <Text
          testID={`${fieldName}Title`}
          {...setTextColor(wellknown)}
          style={[Theme.Styles.subtitle, {fontFamily: 'Inter_600SemiBold'}]}>
          {fieldName}
        </Text>
      )}
    </>
  );
};

export const VCItemFieldValue = ({fieldName, fieldValue, wellknown}) => {
  return (
    <>
      <Text
        testID={`${fieldName}Value`}
        style={[
          Theme.Styles.subtitle,
          setTextColor(wellknown),
          {marginTop: 5},
          {fontFamily: 'Inter_600SemiBold'},
        ]}>
        {fieldValue}
      </Text>
    </>
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
