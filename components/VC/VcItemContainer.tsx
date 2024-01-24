import React from 'react';
import {
  EsignetMosipVCItemProps,
  ExistingMosipVCItemProps,
  MosipVCItem,
} from './MosipVCItem/MosipVCItem';
import {VCCardView} from './Views/VCCardView';
import {Issuers} from '../../shared/openId4VCI/Utils';

export const VcItemContainer: React.FC<
  ExistingMosipVCItemProps | EsignetMosipVCItemProps
> = props => {
  if (props.vcMetadata.issuer === Issuers.Sunbird)
    return <VCCardView {...props} />;
  return <MosipVCItem {...props} />;
};
