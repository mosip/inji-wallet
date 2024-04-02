import {Column, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import React from 'react';

export const VCItemFieldName = ({fieldName, wellknown}) => {
  return (
    <>
      {fieldName && (
        <Text
          testID={`${fieldName}Title`}
          {...setTextColor(wellknown)}
          style={Theme.Styles.fieldItemTitle}>
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
        {...setTextColor(wellknown)}
        style={Theme.Styles.fieldItemValue}>
        {fieldValue}
      </Text>
    </>
  );
};

export const VCItemField = props => {
  return (
    <Column>
      <VCItemFieldName {...props} />
      <VCItemFieldValue {...props} />
    </Column>
  );
};

export const setTextColor = (wellknown: any, component = '') => {
  if (wellknown && wellknown?.credentials_supported[0]?.display) {
    return {
      color: wellknown.credentials_supported[0]?.display[0]?.text_color
        ? wellknown.credentials_supported[0].display[0].text_color
        : component === 'hrLine'
        ? Theme.Styles.hrLine.borderBottomColor
        : Theme.Colors.Details,
    };
  }
};
