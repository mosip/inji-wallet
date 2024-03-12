import {useTranslation} from 'react-i18next';
import {SvgImage} from './ui/svg';
import {useKebabPopUp} from './KebabPopUpController';
import {isActivationNeeded} from '../shared/openId4VCI/Utils';
import {VCShareFlowType} from '../shared/Utils';
import {useNavigation} from '@react-navigation/native';
import {BOTTOM_TAB_ROUTES} from '../routes/routesConstants';

export const getKebabMenuOptions = props => {
  const controller = useKebabPopUp(props);
  const {t} = useTranslation('HomeScreenKebabPopUp');
  const navigation = useNavigation();

  const loadScanScreen = flowType => () => {
    controller.SELECT_VC_ITEM(props.service, flowType),
      controller.GOTO_SCANSCREEN(),
      props.service.send('CLOSE_VC_MODAL');
  };

  const activationNotCompleted =
    controller.emptyWalletBindingId &&
    isActivationNeeded(props?.vcMetadata.issuer);

  const vcActionsList = [
    {
      label: props.vcMetadata.isPinned ? t('unPinCard') : t('pinCard'),
      icon: SvgImage.OutlinedPinIcon(),
      onPress: controller.PIN_CARD,
      testID: 'pinOrUnPinCard',
    },
    {
      label: t('share'),
      icon: SvgImage.OutlinedShareIcon(),
      onPress: loadScanScreen(VCShareFlowType.MINI_VIEW_SHARE),
      testID: 'shareVcFromKebab',
    },
    {
      label: t('viewActivityLog'),
      icon: SvgImage.OutlinedScheduleIcon(),
      onPress: controller.SHOW_ACTIVITY,

      testID: 'viewActivityLog',
    },
    {
      label: t('removeFromWallet'),
      icon: SvgImage.outlinedDeleteIcon(),
      onPress: () => controller.REMOVE(props.vcMetadata),
      testID: 'removeFromWallet',
    },
  ];

  const shareWithSelfieOption = {
    label: t('shareWithSelfie'),
    icon: SvgImage.OutlinedShareWithSelfieIcon(),
    onPress: loadScanScreen(VCShareFlowType.MINI_VIEW_SHARE_WITH_SELFIE),
    testID: 'shareVcWithSelfieFromKebab',
  };

  const VCActivationOption = {
    label: activationNotCompleted
      ? t('WalletBinding:offlineAuthenticationDisabled')
      : isActivationNeeded(props.vcMetadata.issuer)
      ? t('WalletBinding:profileAuthenticated')
      : t('WalletBinding:credentialActivated'),
    icon: SvgImage.OutlinedShieldedIcon(),
    onPress: activationNotCompleted
      ? controller.ADD_WALLET_BINDING_ID
      : loadScanScreen(VCShareFlowType.MINI_VIEW_QR_LOGIN),
    testID: 'pinOrUnPinCard',
  };

  if (props.vcHasImage) {
    vcActionsList.splice(2, 0, shareWithSelfieOption, VCActivationOption);
  }

  return vcActionsList;
};
