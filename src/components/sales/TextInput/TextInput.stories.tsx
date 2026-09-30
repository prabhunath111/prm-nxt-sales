import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TextInput from './TextInput';

export default {
  title: 'components/TextInput',
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

export const Basic: ComponentStory<typeof TextInput> = (args) => <TextInput {...args} />;

Basic.args = {
  placeholder: 'Sample Component',
  multiline: false,
  secureTextEntry: false,
  keyboardType: 'default',
  readonly: true,
  allowFontScaling: true,
  autoCapitalize: 'words',
  autoComplete: 'birthdate-day',
  autoCorrect: true,
  autoFocus: true,
  blurOnSubmit: true,
  cursorColor: '#FFFFFF',
  disableFullscreenUI: false,
  enterKeyHint: 'enter',
  inlineImageLeft: '',
  inlineImagePadding: 0,
  inputAccessoryViewID: '',
  inputMode: 'text',
};
