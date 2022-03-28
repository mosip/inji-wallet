import React from 'react';
import { getVersion } from 'react-native-device-info';
import { ListItem, Switch } from 'react-native-elements';
import { Column, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { MainRouteProps } from '../../routes/main';
import { EditableListItem } from '../../components/EditableListItem';
import { Credits } from './Credits';
import { useProfileScreen } from './ProfileScreenController';

export const ProfileScreen: React.FC<MainRouteProps> = (props) => {
  const controller = useProfileScreen(props);

  return (
    <Column fill padding="24 0" backgroundColor={Colors.LightGrey}>
      <EditableListItem
        label="Name"
        value={controller.name}
        onEdit={controller.UPDATE_NAME}
      />
      <EditableListItem
        label="VC Label"
        value={controller.vcLabel.singular}
        onEdit={controller.UPDATE_VC_LABEL}
      />
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>
            <Text>Language</Text>
          </ListItem.Title>
        </ListItem.Content>
        <Text margin="0 12 0 0" color={Colors.Grey}>
          English
        </Text>
      </ListItem>
      <ListItem bottomDivider disabled={!controller.canUseBiometrics}>
        <ListItem.Content>
          <ListItem.Title>
            <Text>Biometric unlock</Text>
          </ListItem.Title>
        </ListItem.Content>
        <Switch value={controller.isBiometricUnlockEnabled} />
      </ListItem>
      <ListItem bottomDivider disabled>
        <ListItem.Content>
          <ListItem.Title>
            <Text color={Colors.Grey}>Unlock auth factor</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <Credits label="Credits and legal notices" />
      <ListItem bottomDivider onPress={controller.LOGOUT}>
        <ListItem.Content>
          <ListItem.Title>
            <Text>Log-out</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <Text
        weight="semibold"
        margin="32"
        align="center"
        size="smaller"
        color={Colors.Grey}>
        Version: {getVersion()}
      </Text>
    </Column>
  );
};
