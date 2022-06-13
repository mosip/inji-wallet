import React, { useContext, useRef } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { Pressable, StyleSheet } from 'react-native';
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
import { Colors } from './ui/styleUtils';
import { RotatingIcon } from './RotatingIcon';
import { GlobalContext } from '../shared/GlobalContext';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';

const styles = StyleSheet.create({
  title: {
    color: Colors.Black,
    backgroundColor: 'transparent',
  },
  loadingTitle: {
    color: 'transparent',
    backgroundColor: Colors.Grey5,
    borderRadius: 4,
  },
  subtitle: {
    backgroundColor: 'transparent',
  },
  loadingSubtitle: {
    backgroundColor: Colors.Grey,
    borderRadius: 4,
  },
  container: {
    backgroundColor: Colors.White,
  },
  loadingContainer: {
    backgroundColor: Colors.Grey6,
    borderRadius: 4,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fef5eb',
  },
  bgContainer: {
    backgroundColor: '#fef5eb',
    borderRadius: 15,
    marginTop: 10,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 300,
  },
});

const VerifiedIcon: React.FC = () => {
  return (
    <Icon
      name="check-circle"
      color={Colors.Green}
      size={14}
      containerStyle={{ marginStart: 4, bottom: 1 }}
    />
  );
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
  const verifiableCredential = useSelector(service, selectVerifiableCredential);
  const generatedOn = useSelector(service, selectGeneratedOn);

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
      disabled={!verifiableCredential}
      style={styles.bgContainer}>
      <Row
        crossAlign="center"
        margin={props.margin}
        backgroundColor={!verifiableCredential ? Colors.Grey6 : Colors.White}
        style={
          !verifiableCredential ? styles.loadingContainer : styles.container
        }>
        {/* <Column style={styles.logoContainer}>
        <Logo height={30} />
      </Column> */}

        <Column fill style={styles.detailsContainer}>
          <Image
            source={require('../assets/placeholder-photo.png')}
            style={{
              width: 110,
              height: 110,
              resizeMode: 'cover',
              marginTop: 10,
            }}
          />
          <Column margin="0 0 0 50">
            <Column>
              <Text color={Colors.Orange} size="smaller">
                Full name
              </Text>
              <Text weight="bold" size="smaller">
                {!verifiableCredential
                  ? ''
                  : getLocalizedField(
                      verifiableCredential.credentialSubject.fullName
                    )}
              </Text>
            </Column>

            <Column>
              <Text color={Colors.Orange} size="smaller">
                UIN
              </Text>
              <Text
                weight="bold"
                size="smaller"
                style={
                  !verifiableCredential ? styles.loadingTitle : styles.title
                }>
                {!verifiableCredential ? '' : tag || uin}
              </Text>
            </Column>
            <Column>
              <Text color={Colors.Orange} size="smaller">
                Generated on
              </Text>
              <Text
                numLines={1}
                weight="bold"
                size="smaller"
                style={
                  !verifiableCredential
                    ? styles.loadingSubtitle
                    : styles.subtitle
                }>
                {!verifiableCredential ? '' : generatedOn}
              </Text>
            </Column>
            <Column>
              <Text size="smaller" color={Colors.Orange}>
                {t('status')}
              </Text>
              <Row>
                <Text weight="bold" size="smaller">
                  {t('valid')}
                </Text>
                <VerifiedIcon />
              </Row>
            </Column>
          </Column>
        </Column>
        {verifiableCredential ? (
          selectableOrCheck
        ) : (
          <RotatingIcon name="sync" color={Colors.Grey5} />
        )}
      </Row>
    </Pressable>
  );
};

interface VcItemProps {
  vcKey: string;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof vcItemMachine>) => void;
  onShow?: () => void;
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
