import React from 'react';
import {View} from 'react-native';
import {Column, Row, Text} from './ui';
import {Theme} from './ui/styleUtils';
import testIDProps from '../shared/commonUtil';

export const SectionLayout: React.FC<SectionLayoutProps> = ({
  headerIcon,
  headerText,
  children,
  testId,
  marginBottom,
}) => {
  return (
    <View
      {...testIDProps(testId)}
      style={{
        marginLeft: 18,
        marginRight: 18,
        marginTop: 16,
        marginBottom,
        rowGap: 2,
      }}>
      <Row
        style={{
          alignItems: 'center',
          padding: 16,
          backgroundColor: Theme.Colors.whiteBackgroundColor,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        }}>
        {headerIcon}
        <Text
          style={{
            justifyContent: 'center',
            paddingLeft: 12,
            fontFamily: 'Inter_500Medium',
            fontWeight: '600',
            fontSize: 14,
            letterSpacing: 0,
            lineHeight: 17,
          }}
          testID={`${testId}Header`}>
          {headerText}
        </Text>
      </Row>
      <Row
        style={{
          padding: 16,
          backgroundColor: Theme.Colors.whiteBackgroundColor,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
        }}>
        <Column fill>{children}</Column>
      </Row>
    </View>
  );
};

SectionLayout.defaultProps = {
  marginBottom: 0,
};

export type SectionLayoutProps = {
  headerIcon: React.ReactNode;
  headerText: string;
  children: React.ReactNode;
  testId: string;
  marginBottom?: number;
};
