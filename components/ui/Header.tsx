import React from 'react';
import {Text, TouchableOpacity, View, I18nManager} from 'react-native';
import {Icon} from 'react-native-elements';
import {Column, Row} from './Layout';
import {Theme} from './styleUtils';
import testIDProps from '../../shared/commonUtil';

export const Header: React.FC<HeaderProps> = ({goBack, title, testID}) => {
  return (
    <Column safe align="center" testID={testID}>
      <Row elevation={2}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 18,
            marginBottom: 22,
            marginVertical: 16,
          }}>
          <TouchableOpacity onPress={goBack} {...testIDProps('goBack')}>
            {I18nManager.isRTL ? (
              <Icon
                name="arrow-right"
                type="material-community"
                onPress={goBack}
                containerStyle={{
                  ...Theme.Styles.backArrowContainer,
                  marginLeft: 10,
                }}
                color={Theme.Colors.Icon}
              />
            ) : (
              <Icon
                name="arrow-left"
                type="material-community"
                onPress={goBack}
                containerStyle={{
                  ...Theme.Styles.backArrowContainer,
                  marginLeft: 10,
                }}
                color={Theme.Colors.Icon}
              />
            )}
          </TouchableOpacity>
          <Row fill align={'center'}>
            <Column>
              <View style={{alignItems: 'center', marginLeft: -40}}>
                <Text
                  style={Theme.TextStyles.semiBoldHeader}
                  {...testIDProps('title')}>
                  {title}
                </Text>
              </View>
            </Column>
          </Row>
        </View>
      </Row>
    </Column>
  );
};

interface HeaderProps {
  title?: string;
  goBack: () => void;
  testID: string;
}
