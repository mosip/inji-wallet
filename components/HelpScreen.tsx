import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking, Pressable} from 'react-native';
import {Modal} from './ui/Modal';
import {ScrollView} from 'react-native-gesture-handler';
import {Column, Text} from './ui';
import {Theme} from './ui/styleUtils';
import {BackupAndRestoreAllScreenBanner} from './BackupAndRestoreAllScreenBanner';
import getAllConfigurations from '../shared/commonprops/commonProps';

export const HelpScreen: React.FC<HelpScreenProps> = props => {
  const {t} = useTranslation('HelpScreen');

  const [showHelpPage, setShowHelpPage] = useState(false);
  var [injiHelpUrl, setInjiHelpUrl] = useState('');

  useEffect(() => {
    getAllConfigurations().then(response => {
      setInjiHelpUrl(response.aboutInjiUrl);
    });
  }, []);

  const hyperLinkString = (
    word: string,
    urlString: string,
    extension?: string,
  ) => {
    return (
      <Text
        style={Theme.TextStyles.urlLinkText}
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
        <BackupAndRestoreAllScreenBanner />
        <ScrollView>
          <Column fill padding="10" align="space-between">
            <Text style={Theme.TextStyles.helpHeader}>{t('whatIsAnId?')}</Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-10')}</Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('whatAreTheDifferentTypesOfId?')}
            </Text>
            <Text margin="5">
              <Text style={Theme.TextStyles.helpDetails}>{t('detail-11')}</Text>
              <Text
                style={Theme.TextStyles.urlLinkText}
                onPress={() => {
                  Linking.openURL(
                    'https://docs.mosip.io/1.2.0/id-lifecycle-management/identifiers',
                  );
                }}>
                {t('here')}
              </Text>
            </Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('whereCanIFindTheseIds?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-12a')}</Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-12b')}</Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-12c')}</Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('whatIsaDigitalCredential?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-1')}</Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('whatCanWeDoWithDigitalCredential?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-2')}</Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('whatIsAVerifiableCredential?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-15')}</Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('howToAddCard?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>
              {t('detail-3')}
              {hyperLinkString(
                'here',
                injiHelpUrl,
                '/end-user-guide#downloading-vc',
              )}
            </Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('canIAddMultipleCards?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-5')}</Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('whyDoesMyVcSayActivationIsPending?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>
              {t('detail-13')}
              {hyperLinkString(
                'here',
                injiHelpUrl,
                '/end-user-guide#activating-a-vc',
              )}
            </Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('whatDoYouMeanByActivatedForOnlineLogin?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>
              {t('detail-14a')}
              {hyperLinkString(
                'here',
                injiHelpUrl,
                '/overview/features/feature-workflows#id-4.-qr-code-login-process',
              )}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-14b')}</Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('howToActivateACardForOnlineLogin?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-7')}</Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('howToShareACard?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-6')}</Text>
            <Text style={Theme.TextStyles.header}>
              {t('howToRemoveACardFromTheWallet?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>
              {t('detail-4a')}
              {hyperLinkString(
                'here',
                injiHelpUrl,
                '/end-user-guide#deleting-a-vc',
              )}
              {t('detail-4b')}
            </Text>
            <Text style={Theme.TextStyles.helpHeader}>
              {t('howToViewActivityLogs?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetails}>{t('detail-8')}</Text>
            <Text style={Theme.TextStyles.helpHeader}>
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
