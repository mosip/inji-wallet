import React, { useContext, useRef } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { Image, ImageBackground } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
import { ActorRefFrom } from 'xstate';
import {
  createVcItemMachine,
  selectVerifiableCredential,
  selectGeneratedOn,
  selectTag,
  selectId,
  vcItemMachine,
  selectContext,
} from '../machines/vcItem';
import { Column, Row, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { GlobalContext } from '../shared/GlobalContext';
import { RotatingIcon } from './RotatingIcon';
import { useTranslation } from 'react-i18next';

const VerifiedIcon: React.FC = () => {
  return (
    <Icon
      name="check-circle"
      color={Theme.Colors.VerifiedIcon}
      size={14}
      containerStyle={{ marginStart: 4, bottom: 1 }}
    />
  );
};

const getDetails = (arg1, arg2, verifiableCredential) => {
  if (arg1 === 'Full Name') {
    return (
      <Column>
        <Text color={Theme.Colors.DetailsLabel} size="smaller">
          {arg1}
        </Text>
        <Text
          color={Theme.Colors.Details}
          numLines={1}
          weight="bold"
          size="smaller"
          style={
            !verifiableCredential
              ? Theme.Styles.loadingTitle
              : Theme.Styles.subtitle
          }>
          {!verifiableCredential ? '' : arg2}
        </Text>
      </Column>
    );
  }
  if (arg1 === 'Status') {
    return (
      <Column>
        <Text size="smaller" color={Theme.Colors.DetailsLabel}>
          {arg1}
        </Text>
        <Row>
          <Text
            weight="bold"
            color={Theme.Colors.Details}
            size="smaller"
            style={
              !verifiableCredential
                ? Theme.Styles.loadingTitle
                : Theme.Styles.subtitle
            }>
            {!verifiableCredential ? '' : arg2}
          </Text>
          {!verifiableCredential ? null : <VerifiedIcon />}
        </Row>
      </Column>
    );
  } else {
    return (
      <Column>
        <Text color={Theme.Colors.DetailsLabel} size="smaller">
          {arg1}
        </Text>
        <Text
          numLines={1}
          color={Theme.Colors.Details}
          weight="bold"
          size="smaller"
          style={
            !verifiableCredential
              ? Theme.Styles.loadingTitle
              : Theme.Styles.subtitle
          }>
          {!verifiableCredential ? '' : arg2}
        </Text>
      </Column>
    );
  }
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
  const context = useSelector(service, selectContext);
  const verifiableCredential = useSelector(service, selectVerifiableCredential);
  const uin = useSelector(service, selectId);
  const tag = useSelector(service, selectTag);
  const generatedOn = useSelector(service, selectGeneratedOn);
  const fullName = !verifiableCredential
    ? ''
    : getLocalizedField(verifiableCredential.credentialSubject.fullName);

  const selectableOrCheck = props.selectable ? null : null;

  return (
    <Column onShow={props.onShow(service)}>
      <ImageBackground
        source={!verifiableCredential ? null : Theme.CloseCard}
        resizeMode="stretch"
        style={
          !verifiableCredential
            ? Theme.Styles.vertloadingContainer
            : Theme.Styles.backgroundImageContainer
        }>
        <Row style={Theme.Styles.homeCloseCardDetailsHeader}>
          <Image
            source={Theme.MosipLogo}
            style={Theme.Styles.logo}
            resizeMethod="auto"
          />
        </Row>
        <Row
          crossAlign="center"
          margin="5 0 0 0"
          style={!verifiableCredential ? Theme.Styles.loadingContainer : null}>
          <Column
            style={
              !verifiableCredential
                ? Theme.Styles.loadingContainer
                : Theme.Styles.closeDetails
            }>
            <Image
              source={
                !verifiableCredential
                  ? Theme.ProfileIcon
                  : { uri: context.credential.biometrics.face }
              }
              style={Theme.Styles.closeCardImage}
            />

            <Column margin="0 0 0 10">
              {getDetails(t('fullName'), fullName, verifiableCredential)}
              {getDetails(t('uin'), tag || uin, verifiableCredential)}
              {getDetails(t('generatedOn'), generatedOn, verifiableCredential)}
              {getDetails(t('status'), t('valid'), verifiableCredential)}
            </Column>
          </Column>

          {verifiableCredential ? (
            selectableOrCheck
          ) : (
            <RotatingIcon name="sync" color={Theme.Colors.rotatingIcon} />
          )}
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
