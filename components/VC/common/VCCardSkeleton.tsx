import {View} from 'react-native';
import {Theme} from '../../ui/styleUtils';
import {Row} from '../../ui';
import React from 'react';
import {VCCardInnerSkeleton} from './VCCardInnerSkeleton';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

export const VCCardSkeleton = () => {
  return (
    <View style={Theme.Styles.closeCardBgContainer}>
      <VCCardInnerSkeleton />
      <View style={Theme.Styles.horizontalLine} />
      <Row style={[Theme.Styles.activationTab, {height: 30, borderRadius: 20}]}>
        <Row style={Theme.Styles.vcActivationStatusContainer}>
          <Row style={Theme.Styles.vcActivationDetailsWrapper}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={300}
              style={{borderRadius: 5}}
            />
          </Row>
        </Row>
      </Row>
    </View>
  );
};
