import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DealerFeedbackSuccess from './DealerFeedbackSuccess';

export default {
  title: 'components/DealerFeedbackSuccess',
  component: DealerFeedbackSuccess,
} as ComponentMeta<typeof DealerFeedbackSuccess>;

export const Basic: ComponentStory<typeof DealerFeedbackSuccess> = () => <DealerFeedbackSuccess />;

Basic.args = {};
