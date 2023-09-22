import React from 'react';
import {
  EsignetMosipVCItemDetails,
  EsignetMosipVCItemDetailsProps,
} from './EsignetMosipVCItem/EsignetMosipVCItemDetails';
import { VCMetadata } from '../../shared/VCMetadata';
import {
  ExistingMosipVCItemDetails,
  ExistingMosipVCItemDetailsProps,
} from './ExistingMosipVCItem/ExistingMosipVCItemDetails';

export const VcDetailsContainer: React.FC<
  EsignetMosipVCItemDetailsProps | ExistingMosipVCItemDetailsProps
> = (props) => {
  if (VCMetadata.fromVC(props.vc.vcMetadata).isFromOpenId4VCI()) {
    return <EsignetMosipVCItemDetails {...props} />;
  }
  return <ExistingMosipVCItemDetails {...props} />;
};
