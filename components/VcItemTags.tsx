import React from 'react';
import { Chip } from 'react-native-elements';
import { Row, Text } from './ui';
import { Theme } from './ui/styleUtils';

export const VcItemTags: React.FC<{ tag: string }> = (props) => {
  return (
    props.tag !== '' && (
      <Row align="flex-end" margin={[8, 0, 0, 0]}>
        <Chip
          buttonStyle={{
            backgroundColor: Theme.Colors.Icon,
            padding: 4,
          }}
          title={
            <Text
              size="smaller"
              color={Theme.Colors.whiteText}
              margin={[2, 0, 0, 4]}>
              {props.tag}
            </Text>
          }
          icon={{
            name: 'local-offer',
            color: Theme.Colors.whiteText,
            size: 12,
          }}
          iconRight
        />
      </Row>
    )
  );
};
