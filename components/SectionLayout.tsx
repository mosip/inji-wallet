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
        style={Theme.SectionLayoutStyles.headerContainer}>
        {headerIcon}
        <Text
          style={Theme.SectionLayoutStyles.headerText}
          testID={`${testId}Header`}>
          {headerText}
        </Text>
      </Row>
      <Row
        style={Theme.SectionLayoutStyles.content}>
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
