import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable} from 'react-native';
import {Modal} from './ui/Modal';
import {ScrollView} from 'react-native-gesture-handler';
import {Column, Text} from './ui';
import {Theme} from './ui/styleUtils';

export const HelpScreen: React.FC<HelpScreenProps> = props => {
  const {t} = useTranslation('HelpScreen');

  const [showHelpPage, setShowHelpPage] = useState(false);

  return (
    <React.Fragment>
      <Pressable
        accessible={false}
        onPress={() => {
          setShowHelpPage(!showHelpPage);
        }}>
        {props.triggerComponent}
      </Pressable>
      <Modal
        testID="helpScreen"
        isVisible={showHelpPage}
        headerTitle={t('header')}
        headerElevation={2}
        onDismiss={() => {
          setShowHelpPage(!showHelpPage);
        }}>
        <ScrollView>
          <Column fill padding="10" align="space-between">
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whatIsDigitalCredential?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-1')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whatCanDoWithDigitalCredential?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-2')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToAddCard?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-3')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToRemoveCardFromWallet?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-4')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('canWeAddMultipleCards?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-5')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToShareCard?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-6')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToActivateCardForOnlineLogin?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-7')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToViewActivity?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-8')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whatCanDoBiometricsChanged?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-9')}</Text>
          </Column>
        </ScrollView>
      </Modal>
    </React.Fragment>
  );
};

interface HelpScreenProps {
  triggerComponent: React.ReactElement;
}
