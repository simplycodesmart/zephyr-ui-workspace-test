import { provideHttpClient } from '@angular/common/http';
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { ZepIcon } from '../../../zephyr-ui/zep-icon';

const meta: Meta<ZepIcon> = {
  title: 'Zephyr-UI/zep-icon',
  component: ZepIcon,
  decorators: [
    applicationConfig({
      providers: [provideHttpClient()],
    }),
  ],
};

export default meta;
type Story = StoryObj<ZepIcon>;

export const EmptyIcon: Story = {
  args: {
    icon: '',
    size: 24,
    color: '#e61952',
    className: 'material-icons',
  },
};

export const SvgIcon: Story = {
  args: {
    icon: 'accessibility.svg',
  },
};

export const SvgIconInline: Story = {
  args: {
    icon: '<svg><circle cx="12" cy="12" r="10" fill="blue" /></svg>',
  },
};

export const FontIcon: Story = {
  args: {
    size: 32,
    color: 'accent',
    icon: 'home',
  },
};

export const FontIconPrimary: Story = {
  args: {
    size: 48,
    color: 'primary',
    icon: 'favorite',
  },
};

export const FontClassCustom: Story = {
  args: {
    size: 48,
    color: '#e61952',
    icon: 'menu',
    className: 'material-icons',
  },
};

export const InvalidSize: Story = {
  args: {
    size: -1,
    color: '#e61952',
    icon: 'menu',
    className: 'material-icons',
  },
};

export const ErrorLoadingSvg: Story = {
  args: {
    icon: 'accessibility1.svg',
  },
};
