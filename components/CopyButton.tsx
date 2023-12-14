import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {Theme} from './ui/styleUtils';
import Clipboard from '@react-native-clipboard/clipboard';
import {Icon} from 'react-native-elements';
import {Row, Text} from './ui';
import {useTranslation} from 'react-i18next';

export const CopyButton: React.FC<CopyButtonProps> = ({content}) => {
  const {t} = useTranslation('common');
  const [buttonText, setButtonText] = useState(t('clipboard.copy'));

  return (
    <Pressable
      onPress={() => {
        setButtonText(t('clipboard.copied'));
        setTimeout(() => setButtonText(t('clipboard.copy')), 3000);
        Clipboard.setString(content);
      }}>
      <Row align="center">
        <Icon
          type={'material'}
          name={'file-copy'}
          color={Theme.Colors.Icon}
          style={{marginRight: 2}}
          size={19}
        />
        <Text weight="semibold">{buttonText}</Text>
      </Row>
    </Pressable>
  );
};

interface CopyButtonProps {
  content: string;
}
