import React from 'react';

import { Image, View } from 'react-native';

import Markdown from 'react-native-simple-markdown';
import { Column } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import creditsContent from '../../Credits.md';

export const CreditsScreen: React.FC<CreditsProps> = () => {
  const images = {
    'docs/images/newlogic_logo.png': require('../../docs/images/newlogic_logo.png'),
    'docs/images/id_pass_logo.png': require('../../docs/images/id_pass_logo.png'),
  };

  const markdownStyles = {
    text: {
      color: Colors.Black,
      fontFamily: 'Poppins_400Regular',
    },
    heading: {
      fontFamily: 'Poppins_600SemiBold',
      fontWeight: '600',
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
    <Column fill safe backgroundColor={Colors.White} padding="20">
      <Markdown rules={rules} styles={markdownStyles}>
        {creditsContent}
      </Markdown>
    </Column>
  );
};

interface CreditsProps {
  label: string;
}
