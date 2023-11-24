import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {Theme} from './ui/styleUtils';
import Clipboard from '@react-native-clipboard/clipboard';
import {Icon} from 'react-native-elements';
import {Text} from './ui';
import {useTranslation} from 'react-i18next';

export const CopyButton: React.FC<CopyButtonProps> = ({content}) => {
  const {t} = useTranslation('common');
  const [buttonText, setButtonText] = useState(t('clipboard.copy'));

  return (
    <Pressable
      style={Theme.Styles.iconContainer}
      onPress={() => {
        setButtonText(t('clipboard.copied'));
        setTimeout(() => setButtonText(t('clipboard.copy')), 3000);
        Clipboard.setString(content);
      }}>
      <Icon
        type={'material'}
        name={'file-copy'}
        color={Theme.Colors.Icon}
        style={{marginRight: 2}}
        size={19}
      />
      <Text style={{...Theme.TextStyles.semibold, paddingTop: 3, maxWidth: 75}}>
        {buttonText}
      </Text>
    </Pressable>
  );
};

interface CopyButtonProps {
  content: string;
}
