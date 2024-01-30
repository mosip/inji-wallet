import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking, Pressable} from 'react-native';
import {Modal} from './ui/Modal';
import {ScrollView} from 'react-native-gesture-handler';
import {Column, Text} from './ui';
import {Theme} from './ui/styleUtils';
import getAllConfigurations from '../shared/commonprops/commonProps';

export const HelpScreen: React.FC<HelpScreenProps> = props => {
  const {t} = useTranslation('HelpScreen');

  const [showHelpPage, setShowHelpPage] = useState(false);
  const [hereUrl, setHereUrl] = useState('');

  useEffect(() => {
    getAllConfigurations().then(response => {
      setHereUrl(response.aboutInjiUrl);
    });
  }, []);

  var diffTypesOfIdsUrl = hereUrl.slice(0, -4);

  const hyperLinkString = (
    word: string,
    urlString: string,
    extension?: string,
  ) => {
    return (
      <Text
        style={{color: Theme.Colors.urlLink, fontFamily: 'Inter_600SemiBold'}}
        onPress={() => {
          urlString && Linking.openURL(urlString + extension);
        }}>
        {t(word)}
      </Text>
    );
  };

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
              {t('whatIsAnId?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-10')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whatAreTheDifferentTypesOfId?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>
              {t('detail-11')}
              {hyperLinkString(
                'here',
                diffTypesOfIdsUrl,
                '1.2.0/id-lifecycle-management/identifiers',
              )}
            </Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whereCanIFindTheseIds?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-12a')}</Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-12b')}</Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-12c')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whatIsaDigitalCredential?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-1')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whatCanWeDoWithDigitalCredential?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-2')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whatIsAVerifiableCredential?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-15')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToAddCard?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>
              {t('detail-3')}
              {hyperLinkString(
                'here',
                hereUrl,
                '/end-user-guide#downloading-vc',
              )}
            </Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('canIAddMultipleCards?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-5')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whyDoesMyVcSayActivationIsPending?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>
              {t('detail-13')}
              {hyperLinkString(
                'here',
                hereUrl,
                '/end-user-guide#activating-a-vc',
              )}
            </Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whatDoYouMeanByActivatedForOnlineLogin?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>
              {t('detail-14a')}
              {hyperLinkString(
                'here',
                hereUrl,
                '/overview/features/feature-workflows#id-4.-qr-code-login-process',
              )}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-14b')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToActivateACardForOnlineLogin?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-7')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToShareACard?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-6')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToRemoveACardFromTheWallet?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>
              {t('detail-4a')}
              {hyperLinkString(
                'here',
                hereUrl,
                '/end-user-guide#deleting-a-vc',
              )}
              {t('detail-4b')}
            </Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToViewActivityLogs?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-8')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whatHappensWhenAndroidKeystoreBiometricIsChanged?')}
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
