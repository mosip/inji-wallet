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
  if (props.vc.vcMetadata.issuer === Issuers.Sunbird)
    return <VCDetailView {...props} />;
  return <MosipVCItemDetails {...props} />;
};
