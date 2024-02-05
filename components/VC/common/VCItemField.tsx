import {Column, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import React from 'react';
import {setTextColor} from './VCUtils';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import testIDProps from '../../../shared/commonUtil';

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
        {...testIDProps(`${fieldName}Title`)}
        weight="regular"
        size="smaller"
        {...setTextColor(wellknown)}
        style={[Theme.Styles.subtitle]}>
        {fieldName}
      </Text>
      {Array.isArray(fieldValue) ? (
        fieldValue.map(field => (
          <Text
            key={field}
            {...testIDProps(`${field}Value`)}
            weight="semibold"
            style={[Theme.Styles.subtitle, setTextColor(wellknown)]}>
            {field}
          </Text>
        ))
      ) : (
        <Text
          {...testIDProps(`${fieldName}Value`)}
          weight="semibold"
          style={[Theme.Styles.subtitle, setTextColor(wellknown)]}>
          {fieldValue}
        </Text>
      )}
    </Column>
  );
};
