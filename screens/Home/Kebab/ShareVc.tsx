import React from 'react';
import {useKebabPopUp} from '../../../components/KebabPopUpController';
import {ActorRefFrom} from 'xstate';
import {ExistingMosipVCItemMachine} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {SvgImage} from '../../../components/ui/svg';
import {KebabPopupListItemContainer} from '../../../components/KebabPopUp';
import {VCShareFlowType} from '../../../shared/Utils';

export const ShareVc: React.FC<ShareVcProps> = props => {
  const controller = useKebabPopUp(props);

  return (
    <KebabPopupListItemContainer
      label={props.label}
      listItemIcon={
        props.flowType === VCShareFlowType.MINI_VIEW_SHARE
          ? SvgImage.OutlinedShareIcon()
          : SvgImage.OutlinedShareWithSelfieIcon()
      }
      onPress={() => {
        controller.SELECT_VC_ITEM(props.service, props.flowType),
          controller.GOTO_SCANSCREEN(),
          props.service.send('CLOSE_VC_MODAL');
      }}
      testID={props.testID}
    />
  );
};

interface ShareVcProps {
  testID: string;
  label: string;
  service: ActorRefFrom<typeof ExistingMosipVCItemMachine>;
  flowType: string;
}
