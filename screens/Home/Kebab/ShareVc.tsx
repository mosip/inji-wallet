import React from 'react';
import {ListItem} from 'react-native-elements';
import {useKebabPopUp} from '../../../components/KebabPopUpController';
import testIDProps from '../../../shared/commonUtil';
import {Text} from '../../../components/ui';
import {ActorRefFrom} from 'xstate';
import {ExistingMosipVCItemMachine} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {SvgImage} from '../../../components/ui/svg';
import {KebabPopupListItemContainer} from '../../../components/KebabPopUp';

export const ShareVc: React.FC<ShareVcProps> = props => {
  const controller = useKebabPopUp(props);

  return (
    <KebabPopupListItemContainer
      label={props.label}
      listItemIcon={
        props.testID === 'shareVcFromKebab'
          ? SvgImage.OutlinedShareIcon()
          : SvgImage.OutlinedShareWithSelfieIcon()
      }
      onPress={controller.PIN_CARD}
      testID={props.testID}
    />
  );
};

interface ShareVcProps {
  testID: string;
  label: string;
  service: ActorRefFrom<typeof ExistingMosipVCItemMachine>;
}
