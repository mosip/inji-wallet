import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';
import { Button, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { VcItem } from '../../components/VcItem';
import {
  SelectVcOverlayProps,
  useSelectVcOverlay,
} from './SelectVcOverlayController';

export const SelectVcOverlay: React.FC<SelectVcOverlayProps> = (props) => {
  const { t } = useTranslation('SelectVcOverlay');
  const controller = useSelectVcOverlay(props);

  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={Theme.SelectVcOverlayStyles.overlay}>
      <Column
        padding="24"
        width={Dimensions.get('screen').width * 0.9}
        style={{ maxHeight: Dimensions.get('screen').height * 0.9 }}>
        <Text weight="semibold" margin="0 0 16 0">
          {t('header')}
        </Text>
        <Text margin="0 0 16 0">
          {t('chooseVc')} <Text weight="semibold">{props.receiverName}</Text>
        </Text>
        <Column margin="0 0 32 0" scroll>
          {props.vcKeys.map((vcKey, index) => (
            <VcItem
              key={`${vcKey}-${index}`}
              vcKey={vcKey}
              margin="0 2 8 2"
              onPress={controller.selectVcItem(index)}
              selectable
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
