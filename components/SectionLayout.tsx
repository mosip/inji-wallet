import React from 'react';
import {View} from 'react-native';
import {Column, Row, Text} from './ui';
import {Theme} from './ui/styleUtils';

export const SectionLayout: React.FC<SectionLayoutProps> = ({
  headerIcon,
  headerText,
  children,
}) => {
  return (
    <View
      style={{
        marginLeft: 18,
        marginRight: 18,
        marginTop: 16,
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
            fontFamily: 'Inter',
            fontWeight: '600',
            fontSize: 14,
          }}>
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
        <Column>{children}</Column>
      </Row>
    </View>
  );
};

export type SectionLayoutProps = {
  headerIcon: React.ReactNode;
  headerText: string;
  children: React.ReactNode;
};
