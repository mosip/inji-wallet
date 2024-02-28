import React from 'react';
import {useTranslation} from 'react-i18next';
import {RefreshControl} from 'react-native';
import {Icon} from 'react-native-elements';
import {Centered, Column, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {HomeScreenTabProps} from './HomeScreen';
import {useReceivedVcsTab} from './ReceivedVcsTabController';
import {VcItemContainer} from '../../components/VC/VcItemContainer';
import {VCItemContainerFlowType} from '../../shared/Utils';

export const ReceivedVcsTab: React.FC<HomeScreenTabProps> = props => {
  const {t} = useTranslation('ReceivedVcsTab');
  const controller = useReceivedVcsTab();

  return (
    <Column fill style={{display: props.isVisible ? 'flex' : 'none'}}>
      <Column
        scroll
        padding="32 24"
        refreshControl={
          <RefreshControl
            refreshing={controller.isRefreshingVcs}
            onRefresh={controller.REFRESH}
          />
        }>
        {controller.receivedVcsMetadata.map(vcMetadata => (
          <VcItemContainer
            key={vcMetadata.getVcKey()}
            vcMetadata={vcMetadata}
            margin="0 2 8 2"
            onPress={controller.VIEW_VC}
            flow={VCItemContainerFlowType.VC_SHARE}
          />
        ))}
        {controller.receivedVcsMetadata.length === 0 && (
          <React.Fragment>
            <Centered fill>
              <Icon
                style={{marginBottom: 20}}
                size={40}
                name="sentiment-dissatisfied"
              />
              <Text align="center" weight="semibold" margin="0 0 4 0">
                {t('noReceivedVcsTitle')}
              </Text>
              <Text align="center" color={Theme.Colors.textLabel}>
                {t('noReceivedVcsText')}
              </Text>
            </Centered>
          </React.Fragment>
        )}
      </Column>
    </Column>
  );
};
