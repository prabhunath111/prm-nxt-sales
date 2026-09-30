import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Modal from './Modal';

export default {
  title: 'components/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

export const Basic: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

Basic.args = {
  isVisible: true,
  onClose: () => ({}),
  modalStyle: {},
  children: '',
};
