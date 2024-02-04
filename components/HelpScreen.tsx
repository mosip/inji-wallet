import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking, Pressable, View} from 'react-native';
import {Modal} from './ui/Modal';
import {ScrollView} from 'react-native-gesture-handler';
import {Column, Text} from './ui';
import {Theme} from './ui/styleUtils';
import {BackupAndRestoreAllScreenBanner} from './BackupAndRestoreAllScreenBanner';
import getAllConfigurations from '../shared/commonprops/commonProps';

export const HelpScreen: React.FC<HelpScreenProps> = props => {
  const {t} = useTranslation('HelpScreenFor' + props.source);
  const [showHelpPage, setShowHelpPage] = useState(false);
  var [injiHelpUrl, setInjiHelpUrl] = useState('');

  useEffect(() => {
    getAllConfigurations().then(response => {
      setInjiHelpUrl(response.aboutInjiUrl);
    });
  }, []);

  const getTextField = (value: string, component?: React.ReactElement) => {
    return (
      <Text style={Theme.TextStyles.helpDetails}>
        {value} {component}
      </Text>
    );
  };
  const getLinkedText = (link: string, linkText: string) => {
    return (
      <Text
        style={Theme.TextStyles.urlLinkText}
        onPress={() => {
          Linking.openURL(link);
        }}>
        {linkText}
      </Text>
    );
  };
  const BackupFaqMap = [
    {
      heading: t('questions.one'),
      value: <React.Fragment>{getTextField(t('answers.one'))}</React.Fragment>,
    },
    {
      heading: t('questions.two'),
      value: <React.Fragment>{getTextField(t('answers.two'))}</React.Fragment>,
    },
    {
      heading: t('questions.three'),
      value: (
        <React.Fragment>{getTextField(t('answers.three'))}</React.Fragment>
      ),
    },
    {
      heading: t('questions.four'),
      value: <React.Fragment>{getTextField(t('answers.four'))}</React.Fragment>,
    },
    {
      heading: t('questions.five'),
      value: <React.Fragment>{getTextField(t('answers.five'))}</React.Fragment>,
    },
    {
      heading: t('questions.six'),
      value: <React.Fragment>{getTextField(t('answers.six'))}</React.Fragment>,
    },
    {
      heading: t('questions.seven'),
      value: (
        <React.Fragment>{getTextField(t('answers.seven'))}</React.Fragment>
      ),
    },
    {
      heading: t('questions.eight'),
      value: (
        <React.Fragment>{getTextField(t('answers.eight'))}</React.Fragment>
      ),
    },
  ];

  const InjiFaqMap = [
    {
      heading: t('questions.one'),
      value: <React.Fragment>{getTextField(t('answers.one'))}</React.Fragment>,
    },
    {
      heading: t('questions.two'),
      value: <React.Fragment>{getTextField(t('answers.two'))}</React.Fragment>,
    },
    {
      heading: t('questions.three'),
      value: (
        <React.Fragment>
          {getTextField(
            t('answers.three'),
            getLinkedText(
              injiHelpUrl + '/end-user-guide#downloading-vc',
              t('here'),
            ),
          )}
        </React.Fragment>
      ),
    },
    {
      heading: t('questions.four'),
      value: (
        <React.Fragment>
          {getTextField(
            t('answers.four-a'),
            getLinkedText(
              injiHelpUrl + '/end-user-guide#deleting-a-vc',
              t('here'),
            ),
          )}
          {getTextField(t('answers.four-b'))}
        </React.Fragment>
      ),
    },
    {
      heading: t('questions.five'),
      value: <React.Fragment>{getTextField(t('answers.five'))}</React.Fragment>,
    },
    {
      heading: t('questions.six'),
      value: <React.Fragment>{getTextField(t('answers.six'))}</React.Fragment>,
    },
    {
      heading: t('questions.seven'),
      value: (
        <React.Fragment>{getTextField(t('answers.seven'))}</React.Fragment>
      ),
    },
    {
      heading: t('questions.eight'),
      value: (
        <React.Fragment>{getTextField(t('answers.eight'))}</React.Fragment>
      ),
    },
    {
      heading: t('questions.nine'),
      value: <React.Fragment>{getTextField(t('answers.nine'))}</React.Fragment>,
    },
    {
      heading: t('questions.ten'),
      value: <React.Fragment>{getTextField(t('answers.ten'))}</React.Fragment>,
    },
    {
      heading: t('questions.eleven'),
      value: (
        <React.Fragment>
          {getTextField(
            t('answers.eleven'),
            getLinkedText(
              'https://docs.mosip.io/1.2.0/id-lifecycle-management/identifiers',
              t('here'),
            ),
          )}
        </React.Fragment>
      ),
    },
    {
      heading: t('questions.twelve'),
      value: (
        <React.Fragment>
          {getTextField(t('answers.twelve-a'))}
          {getTextField(t('answers.twelve-b'))}
          {getTextField(t('answers.twelve-c'))}
        </React.Fragment>
      ),
    },
    {
      heading: t('questions.thirteen'),
      value: (
        <React.Fragment>
          {getTextField(
            t('answers.thirteen'),
            getLinkedText(
              injiHelpUrl + '/end-user-guide#activating-a-vc',
              t('here'),
            ),
          )}
        </React.Fragment>
      ),
    },
    {
      heading: t('questions.fourteen'),
      value: (
        <React.Fragment>
          {getTextField(
            t('answers.fourteen-a'),
            getLinkedText(
              injiHelpUrl +
                '/overview/features/feature-workflows#id-4.-qr-code-login-process',
              t('here'),
            ),
          )}
          {getTextField(t('answers.fourteen-b'))}
        </React.Fragment>
      ),
    },
    {
      heading: t('questions.fifteen'),
      value: (
        <React.Fragment>{getTextField(t('answers.fifteen'))}</React.Fragment>
      ),
    },
  ];

  const faqMap = props.source === 'Inji' ? InjiFaqMap : BackupFaqMap;

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
            {faqMap.map(faq => {
              return (
                <View>
                  <Text style={Theme.TextStyles.helpHeader}>{faq.heading}</Text>
                  {faq.value}
                </View>
              );
            })}
          </Column>
        </ScrollView>
      </Modal>
    </React.Fragment>
  );
};

interface HelpScreenProps {
  source: 'Inji' | 'BackUp';
  triggerComponent: React.ReactElement;
}
