import type {
  VbenFormSchema as FormSchema,
  VbenFormProps,
} from '@seasun/common-ui';

import type { ComponentType } from './component';

import { setupVbenForm, useVbenForm as useForm, z } from '@seasun/common-ui';
import { $t } from '@seasun/locales';

setupVbenForm<ComponentType>({
  config: {
    modelPropNameMap: {
      Upload: 'fileList',
      CheckboxGroup: 'model-value',
    },
  },
  defineRules: {
    required: (value, _params, ctx) => {
      if (value === undefined || value === null || value.length === 0) {
        return $t('ui.formRules.required', [ctx.label]);
      }
      return true;
    },
    selectRequired: (value, _params, ctx) => {
      if (value === undefined || value === null) {
        return $t('ui.formRules.selectRequired', [ctx.label]);
      }
      return true;
    },
  },
});

const useVbenForm = useForm<ComponentType>;

export { useVbenForm, z };

export type VbenFormSchema = FormSchema<ComponentType>;
export type { VbenFormProps };
