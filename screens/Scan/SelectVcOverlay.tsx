import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import {Overlay} from 'react-native-elements/dist/overlay/Overlay';
import {Button, Column, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {
  SelectVcOverlayProps,
  useSelectVcOverlay,
} from './SelectVcOverlayController';
import {VcItemContainer} from '../../components/VC/VcItemContainer';
import {VCItemContainerFlowType} from '../../shared/Utils';

export const SelectVcOverlay: React.FC<SelectVcOverlayProps> = props => {
  const {t} = useTranslation('SelectVcOverlay');
  const controller = useSelectVcOverlay(props);

  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={Theme.SelectVcOverlayStyles.overlay}>
      <Column
        padding="24"
        width={Dimensions.get('screen').width * 0.9}
        style={{maxHeight: Dimensions.get('screen').height * 0.9}}>
        <Text weight="semibold" margin="0 0 16 0">
          {t('header')}
        </Text>
        <Text margin="0 0 16 0">
          {t('chooseVc')} <Text weight="semibold">{props.receiverName}</Text>
        </Text>
        <Column margin="0 0 32 0" scroll>
          {props.vcMetadatas.map((vcMetadata, index) => (
            <VcItemContainer
              key={`${vcMetadata.getVcKey()}-${index}`}
              vcMetadata={vcMetadata}
              margin="0 2 8 2"
              onPress={controller.selectVcItem(index)}
              selectable
              flow={VCItemContainerFlowType.VC_SHARE}
              selected={index === controller.selectedIndex}
            />
          ))}
        </Column>
        <Button
          title={t('share')}
          disabled={controller.selectedIndex == null}
          onPress={controller.onSelect}
          margin="8 0 0 0"
        />
        <Button
          type="outline"
          title={t('verifyAndShare')}
          disabled={controller.selectedIndex == null}
          onPress={controller.onVerifyAndSelect}
          margin="8 0 0 0"
        />
        <Button
          type="clear"
          title={t('common:cancel')}
          onPress={props.onCancel}
          margin="8 0 0 0"
        />
      </Column>
    </Overlay>
  );
};
