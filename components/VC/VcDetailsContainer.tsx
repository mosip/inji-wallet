import React from 'react';
import {
  EsignetVCItemDetailsProps,
  ExistingVCItemDetailsProps,
  VCDetailView,
} from './Views/VCDetailView';

export const VcDetailsContainer: React.FC<
  ExistingVCItemDetailsProps | EsignetVCItemDetailsProps
> = props => {
  return <VCDetailView {...props} />;
};
