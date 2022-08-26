import React, { useContext, useRef } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { Pressable } from 'react-native';
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

export const VcItem: React.FC<VcItemProps> = (props) => {
  const { appService } = useContext(GlobalContext);
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
  ) : (
    <Icon name="chevron-right" />
  );

  return (
    <Pressable
      onPress={() => props.onPress(service)}
      disabled={!verifiableCredential}>
      <Row
        elevation={!verifiableCredential ? 0 : 2}
        crossAlign="center"
        margin={props.margin}
        backgroundColor={
          !verifiableCredential
            ? Theme.Colors.loadingLabel
            : Theme.Colors.whiteBackgroundColor
        }
        padding="16 24"
        style={
          !verifiableCredential
            ? Theme.VcItemStyles.loadingContainer
            : Theme.VcItemStyles.container
        }>
        <Column fill margin="0 24 0 0">
          <Text
            weight="semibold"
            style={
              !verifiableCredential
                ? Theme.VcItemStyles.loadingTitle
                : Theme.VcItemStyles.title
            }
            margin="0 0 6 0">
            {!verifiableCredential ? '' : tag || uin}
          </Text>
          <Text
            size="smaller"
            numLines={1}
            style={
              !verifiableCredential
                ? Theme.VcItemStyles.loadingSubtitle
                : Theme.VcItemStyles.subtitle
            }>
            {!verifiableCredential
              ? ''
              : getLocalizedField(
                  verifiableCredential.verifiableCredential.credentialSubject
                    .fullName
                ) +
                ' · ' +
                generatedOn}
          </Text>
        </Column>

        {verifiableCredential ? (
          selectableOrCheck
        ) : (
          <RotatingIcon name="sync" color={Theme.Colors.rotatingIcon} />
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
