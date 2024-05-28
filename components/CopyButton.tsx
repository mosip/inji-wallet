import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {Theme} from './ui/styleUtils';
import Clipboard from '@react-native-clipboard/clipboard';
import {Icon} from 'react-native-elements';
import {Row, Text} from './ui';
import {useTranslation} from 'react-i18next';
import testIDProps from '../shared/commonUtil';
import i18next from '../i18n';

export const CopyButton: React.FC<CopyButtonProps> = ({content}) => {
  const {t} = useTranslation('common');
  const [buttonText, setButtonText] = useState(t('clipboard.copy'));
  return (
    <Pressable
      {...testIDProps(`${buttonText}Button`)}
      accessible={false}
      onPress={() => {
        setButtonText(t('clipboard.copied'));
        setTimeout(() => setButtonText(t('clipboard.copy')), 3000);
        Clipboard.setString(content);
      }}>
      <Row>
        <Icon
          {...testIDProps('fileCopyIcon')}
          type={'material'}
          name={'file-copy'}
          color={Theme.Colors.Icon}
          style={{marginRight: 2}}
          size={19}
        />
        <Text
          testID={`${buttonText}Text`}
          weight="semibold"
          align="center"
          style={{
            maxWidth: 130,
            paddingTop:
              i18next.language == 'kn' || i18next.language == 'hi' ? 5 : 0,
          }}>
          {buttonText}
        </Text>
      </Row>
    </Pressable>
  );
};

interface CopyButtonProps {
  content: string;
}
