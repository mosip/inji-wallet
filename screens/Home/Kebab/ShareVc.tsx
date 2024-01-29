import React from 'react';
import {ListItem} from 'react-native-elements';
import {useKebabPopUp} from '../../../components/KebabPopUpController';
import testIDProps from '../../../shared/commonUtil';
import {Text} from '../../../components/ui';
import {ActorRefFrom} from 'xstate';
import {ExistingMosipVCItemMachine} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';

export const ShareVc: React.FC<ShareVcProps> = props => {
  const controller = useKebabPopUp(props);

  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title
          onPress={controller.PIN_CARD} //TODO : change this to show scan layout with scan screen as default screen
          {...testIDProps(props.testID)}>
          <Text size="small" weight="bold">
            {props.label}
          </Text>
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

interface ShareVcProps {
  testID?: string;
  label: string;
  service: ActorRefFrom<typeof ExistingMosipVCItemMachine>;
}
