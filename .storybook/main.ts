import type { StorybookConfig } from "@storybook/angular";

const config: StorybookConfig = {
  stories: [
    "./../zephyr-ui-stories/components/**/*.stories.ts"
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  staticDirs: ['./../zephyr-ui-stories/assets'],
};
export default config;
