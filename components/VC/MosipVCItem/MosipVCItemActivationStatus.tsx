import React from 'react';
import {Icon} from 'react-native-elements';
import {Theme} from '../../ui/styleUtils';

const WalletUnverifiedIcon: React.FC = () => {
  return (
    <Icon
      name="shield-alert"
      color={Theme.Colors.Icon}
      size={Theme.ICON_MID_SIZE}
      type="material-community"
      containerStyle={{
        marginLeft: 10,
      }}
    />
  );
};

const WalletVerifiedIcon: React.FC = () => {
  return (
    <Icon
      name="verified-user"
      color={Theme.Colors.VerifiedIcon}
      size={Theme.ICON_MID_SIZE}
      containerStyle={{
        marginLeft: 10,
      }}
    />
  );
};

export const MiniCardViewActivationStatus: React.FC<
  ExistingMiniCardViewActivationStatusProps
> = props => {
  return (
    <>
      {props.emptyWalletBindingId ? (
        <WalletUnverifiedIcon />
      ) : (
        <WalletVerifiedIcon />
      )}
    </>
  );
};

interface ExistingMiniCardViewActivationStatusProps {
  emptyWalletBindingId: boolean;
}
