import React from 'react';
import {
  EsignetMosipVCItemProps,
  MosipVCItem,
  ExistingMosipVCItemProps,
} from './MosipVCItem/MosipVCItem';

export const VcItemContainer: React.FC<
  ExistingMosipVCItemProps | EsignetMosipVCItemProps
> = props => {
  return <MosipVCItem {...props} />;
};
