import React from 'react';
import {
  EsignetMosipVCItemProps,
  ExistingMosipVCItemProps,
  MosipVCItem,
} from './MosipVCItem/MosipVCItem';
import {CARD_TEMPLATIZATION} from 'react-native-dotenv';
import {VCCardView} from './Views/VCCardView';

export const VcItemContainer: React.FC<
  ExistingMosipVCItemProps | EsignetMosipVCItemProps
> = props => {
  return <VCCardView {...props} />;
};
