import React from 'react';
import {
  EsignetMosipVCItemDetailsProps,
  ExistingMosipVCItemDetailsProps,
  MosipVCItemDetails,
} from './MosipVCItem/MosipVCItemDetails';

import {CARD_TEMPLATIZATION} from 'react-native-dotenv';
import {VCDetailView} from './Views/VCDetailView';

export const VcDetailsContainer: React.FC<
  ExistingMosipVCItemDetailsProps | EsignetMosipVCItemDetailsProps
> = props => {
  if (CARD_TEMPLATIZATION === 'true') return <VCDetailView {...props} />;
  return <MosipVCItemDetails {...props} />;
};
