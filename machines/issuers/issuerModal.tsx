import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { IssuerModelProps, useIssuerService } from './IssuerScreenController';
import { IssuersList } from './IssuersList';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements';

export const IssuerListModel: React.FC<IssuerModelProps> = (props) => {
  const controller = useIssuerService(props);
  const { t } = useTranslation('IssuersListScreen');
  return (
    <Modal
      isVisible={props.isVisible}
      headerTitle={t('title')}
      arrowLeft={<Icon name={''} />}
      onDismiss={controller.DISMISS}
      headerElevation={2}>
      <ScrollView>
        <IssuersList controller={controller} />
      </ScrollView>
    </Modal>
  );
};
