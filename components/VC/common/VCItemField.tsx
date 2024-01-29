import {Column, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import React from 'react';
import {setTextColor} from './VCUtils';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {Tooltip} from 'react-native-elements';

export const VCItemFieldName = ({
  verifiableCredential,
  fieldName,
  wellknown,
}) => {
  if (!verifiableCredential) {
    return (
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        width={150}
        style={{marginBottom: 5, borderRadius: 5}}
      />
    );
  }

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

export const VCItemFieldValue = ({
  verifiableCredential,
  fieldName,
  fieldValue,
  wellknown,
}) => {
  if (!verifiableCredential) {
    return (
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        width={180}
        style={{borderRadius: 5}}
      />
    );
  }

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
        style={[Theme.Styles.subtitle, setTextColor(wellknown)]}>
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
