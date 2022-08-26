import React, { useContext, useRef } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { Pressable, Image, ImageBackground } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
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
import { RotatingIcon } from './RotatingIcon';
import { GlobalContext } from '../shared/GlobalContext';
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

const getDetails = (arg1, arg2, context) => {
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
            !context.verifiableCredential
              ? Theme.Styles.loadingTitle
              : Theme.Styles.subtitle
          }>
          {!context.verifiableCredential ? '' : arg2}
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
              !context.verifiableCredential
                ? Theme.Styles.loadingTitle
                : Theme.Styles.subtitle
            }>
            {!context.verifiableCredential ? '' : arg2}
          </Text>
          {!context.verifiableCredential ? null : <VerifiedIcon />}
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
            !context.verifiableCredential
              ? Theme.Styles.loadingTitle
              : Theme.Styles.subtitle
          }>
          {arg2}
        </Text>
      </Column>
    );
  }
};

export const UpdatedVcItem: React.FC<VcItemProps> = (props) => {
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
  const fullName = !context.verifiableCredential
    ? ''
    : getLocalizedField(
        context.verifiableCredential.credentialSubject.fullName
      );

  const selectableOrCheck = props.selectable ? (
    <CheckBox
      checked={props.selected}
      checkedIcon={<Icon name="radio-button-checked" />}
      uncheckedIcon={<Icon name="radio-button-unchecked" />}
      onPress={() => props.onPress(service)}
    />
  ) : null;

  return (
    <Pressable
      onPress={() => props.onPress(service)}
      disabled={!context.verifiableCredential}
      style={Theme.Styles.closeCardBgContainer}>
      <ImageBackground
        source={!context.verifiableCredential ? null : Theme.CloseCard}
        resizeMode="stretch"
        style={
          !context.verifiableCredential
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
          style={
            !context.verifiableCredential ? Theme.Styles.loadingContainer : null
          }>
          <Column
            style={
              !context.verifiableCredential
                ? Theme.Styles.loadingContainer
                : Theme.Styles.closeDetails
            }>
            <Image
              source={
                !context.verifiableCredential
                  ? Theme.ProfileIcon
                  : { uri: context.credential.biometrics.face }
              }
              style={Theme.Styles.closeCardImage}
            />

            <Column margin="0 0 0 10">
              {getDetails('Full Name', fullName, context)}
              {getDetails('UIN', tag || uin, context)}
              {getDetails('Generated On', generatedOn, context)}
              {getDetails('Status', t('valid'), context)}
            </Column>
          </Column>

          {context.verifiableCredential ? (
            selectableOrCheck
          ) : (
            <RotatingIcon name="sync" color={Theme.Colors.rotatingIcon} />
          )}
        </Row>
      </ImageBackground>
    </Pressable>
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
