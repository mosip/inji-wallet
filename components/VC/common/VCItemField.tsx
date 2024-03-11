import {Column, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

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
      {Array.isArray(fieldValue) ? (
        fieldValue.map(field => (
          <Text
            key={field}
            testID={`${field}Value`}
            weight="semibold"
            style={[Theme.Styles.subtitle, setTextColor(wellknown)]}>
            {field}
          </Text>
        ))
      ) : (
        <Text
          testID={`${fieldName}Value`}
          weight="semibold"
          style={[Theme.Styles.subtitle, setTextColor(wellknown)]}>
          {fieldValue}
        </Text>
      )}
    </Column>
  );
};

export const setTextColor = (wellknown: any) => {
  if (wellknown && wellknown?.credentials_supported[0]?.display) {
    return {
      color: wellknown.credentials_supported[0]?.display[0]?.text_color
        ? wellknown.credentials_supported[0].display[0].text_color
        : Theme.Colors.textValue,
    };
  }
};
