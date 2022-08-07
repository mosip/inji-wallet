import React, { useContext, useRef } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { Image, ImageBackground } from 'react-native';
import { Icon } from 'react-native-elements';
import { ActorRefFrom } from 'xstate';
import {
  createVcItemMachine,
  selectVerifiableCredential,
  selectGeneratedOn,
  selectTag,
  selectId,
  vcItemMachine,
} from '../machines/vcItem';
import { Column, Row, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { GlobalContext } from '../shared/GlobalContext';
import { useTranslation } from 'react-i18next';

const VerifiedIcon: React.FC = () => {
  return (
    <Icon
      name="check-circle"
      color={Theme.Colors.Green}
      size={14}
      containerStyle={{ marginStart: 4, bottom: 1 }}
    />
  );
};

export const SingleVcItem: React.FC<VcItemProps> = (props) => {
  const { appService } = useContext(GlobalContext);
  const { t } = useTranslation('VcDetails');

  const machine = useRef(
    createVcItemMachine(
      appService.getSnapshot().context.serviceRefs,
      props.vcKey
    )
  );
  const service = useInterpret(machine.current);

  const uin = useSelector(service, selectId);
  const tag = useSelector(service, selectTag);

  const context = useSelector(service, selectVerifiableCredential);
  const generatedOn = useSelector(service, selectGeneratedOn);

  return (
    <Column onShow={props.onShow(service)}>
      <ImageBackground
        source={!context.verifiableCredential ? null : Theme.CloseCard}
        style={
          !context.verifiableCredential
            ? Theme.Styles.loadingContainer
            : Theme.Styles.closeDetailsContainer
        }>
        <Row
          crossAlign="center"
          style={
            !context.verifiableCredential
              ? Theme.Styles.loadingContainer
              : Theme.Styles.closeDetailsContainer
          }>
          <Column
            style={
              !context.verifiableCredential
                ? Theme.Styles.loadingContainer
                : Theme.Styles.closeDetailsContainer
            }>
            <Image
              source={
                !context.verifiableCredential
                  ? Theme.ProfileIcon
                  : { uri: context.credential.biometrics.face }
              }
              style={Theme.Styles.closeCardImage}
            />

            <Column margin="0 0 0 50">
              <Column>
                <Text color={Theme.Colors.DetailsLabel} size="smaller">
                  Full name
                </Text>
                <Text
                  weight="bold"
                  size="smaller"
                  style={
                    !context.verifiableCredential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.title
                  }>
                  {!context.verifiableCredential
                    ? ''
                    : getLocalizedField(
                        context.verifiableCredential.credentialSubject.fullName
                      )}
                </Text>
              </Column>

              <Column>
                <Text color={Theme.Colors.DetailsLabel} size="smaller">
                  UIN
                </Text>
                <Text
                  weight="bold"
                  size="smaller"
                  style={
                    !context.verifiableCredential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.title
                  }>
                  {!context.verifiableCredential ? '' : tag || uin}
                </Text>
              </Column>
              <Column>
                <Text color={Theme.Colors.DetailsLabel} size="smaller">
                  Generated on
                </Text>
                <Text
                  numLines={1}
                  weight="bold"
                  size="smaller"
                  style={
                    !context.verifiableCredential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.subtitle
                  }>
                  {!context.verifiableCredential ? '' : generatedOn}
                </Text>
              </Column>
              <Column>
                <Text size="smaller" color={Theme.Colors.DetailsLabel}>
                  {t('status')}
                </Text>
                <Row>
                  <Text
                    weight="bold"
                    size="smaller"
                    style={
                      !context.verifiableCredential
                        ? Theme.Styles.loadingTitle
                        : Theme.Styles.subtitle
                    }>
                    {!context.verifiableCredential ? '' : t('valid')}
                  </Text>
                  {!context.verifiableCredential ? null : <VerifiedIcon />}
                </Row>
              </Column>
            </Column>
          </Column>
        </Row>
      </ImageBackground>
    </Column>
  );
};

interface VcItemProps {
  vcKey: string;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof vcItemMachine>) => void;
  onShow?: (vcRef?: ActorRefFrom<typeof vcItemMachine>) => void;
}

interface LocalizedField {
  language: string;
  value: string;
}

function getLocalizedField(rawField: string | LocalizedField) {
  if (typeof rawField === 'string') {
    return rawField;
  }
  try {
    const locales: LocalizedField[] = JSON.parse(JSON.stringify(rawField));
    return locales[0].value;
  } catch (e) {
    return '';
  }
}
