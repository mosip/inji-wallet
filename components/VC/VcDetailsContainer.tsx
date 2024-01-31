import React from 'react';
import {
  EsignetMosipVCItemDetailsProps,
  ExistingMosipVCItemDetailsProps,
  MosipVCItemDetails,
} from './MosipVCItem/MosipVCItemDetails';
import {VCDetailView} from './Views/VCDetailView';
import {Issuers} from '../../shared/openId4VCI/Utils';

export const VcDetailsContainer: React.FC<
  ExistingMosipVCItemDetailsProps | EsignetMosipVCItemDetailsProps
> = props => {
  return <VCDetailView {...props} />;
};
