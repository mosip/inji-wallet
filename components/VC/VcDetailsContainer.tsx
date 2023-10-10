import React from 'react';
import {
  MosipVCItemDetails,
  ExistingMosipVCItemDetailsProps,
  EsignetMosipVCItemDetailsProps,
} from './MosipVCItem/MosipVCItemDetails';

export const VcDetailsContainer: React.FC<
  ExistingMosipVCItemDetailsProps | EsignetMosipVCItemDetailsProps
> = props => {
  return <MosipVCItemDetails {...props} />;
};
