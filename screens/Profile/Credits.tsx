import React, { useState } from 'react';
import Markdown from 'react-native-simple-markdown';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView, View } from 'react-native';
import { Divider, Icon, ListItem, Overlay } from 'react-native-elements';

import { Button, Text, Row, Column } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import creditsContent from '../../Credits.md';

export const Credits: React.FC<CreditsProps> = (props) => {
  const { t } = useTranslation('Credits');
  const [isViewing, setIsViewing] = useState(false);
  const images = {
    'docs/images/newlogic_logo.png': require('../../docs/images/newlogic_logo.png'),
    'docs/images/id_pass_logo.png': require('../../docs/images/id_pass_logo.png'),
  };

  const markdownStyles = {
    heading1: {
      fontSize: 24,
      textAlign: 'left',
    },
    heading2: {
      fontSize: 24,
      textAlign: 'left',
    },
    image: {
      maxWidth: 150,
      margin: 0,
    },
  };

  const rules = {
    image: {
      react: (node, output, state) => (
        <View key={`image-${state.key}`}>
          <Image
            style={{ maxWidth: 150, height: 100 }}
            source={images[node.target]}
            resizeMode="contain"
          />
        </View>
      ),
    },
  };

  return (
    <ListItem bottomDivider onPress={() => setIsViewing(true)}>
      <ListItem.Content>
        <ListItem.Title>
          <Text color={props.color}>{props.label}</Text>
        </ListItem.Title>
      </ListItem.Content>
      <Overlay
        overlayStyle={{ padding: 24 }}
        isVisible={isViewing}
        onBackdropPress={() => setIsViewing(false)}>
        <SafeAreaView>
          <View style={Theme.CreditsStyles.view}>
            <Row align="center" crossAlign="center" margin="0 0 10 0">
              <View style={Theme.CreditsStyles.buttonContainer}>
                <Button
                  type="clear"
                  icon={<Icon name="chevron-left" color={Theme.Colors.Icon} />}
                  title=""
                  onPress={() => setIsViewing(false)}
                />
              </View>
              <Text size="small">{t('header')}</Text>
            </Row>
            <Divider />
            <View style={Theme.CreditsStyles.markdownView}>
              <Markdown rules={rules} styles={markdownStyles}>
                {creditsContent}
              </Markdown>
            </View>
          </View>
        </SafeAreaView>
      </Overlay>
    </ListItem>
  );
};

interface CreditsProps {
  label: string;
  color?: string;
}
