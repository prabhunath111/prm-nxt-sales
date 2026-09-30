import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import OfferSelectionTable from './OfferSelectionTable';

export default {
  title: 'components/OfferSelectionTable',
  component: OfferSelectionTable,
} as ComponentMeta<typeof OfferSelectionTable>;

export const Basic: ComponentStory<typeof OfferSelectionTable> = (args) => <OfferSelectionTable {...args} />;

Basic.args = {};
