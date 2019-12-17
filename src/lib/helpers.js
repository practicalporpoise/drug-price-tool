import { FieldTypes, StepTypes } from './constants';

export const Fields = {
  Autocomplete: (name, params) => ({ name, type: FieldTypes.Autocomplete, ...params }),
  Date: (name, params) => ({ name, type: FieldTypes.Date, ...params }),
  Email: (name, params) => ({ name, type: FieldTypes.Email, ...params }),
  Radio: (name, options, params) => ({ name, type: FieldTypes.Radio, options, ...params }),
  Text: (name, params) => ({ name, type: FieldTypes.Text, ...params }),
};

export const Steps = {
  Decision: (key, fn) => ({ key, type: StepTypes.Decision, fn }),
  Fetch: (key, fn, params) => ({ key, type: StepTypes.Fetch, fn, ...params }),
  Form: (key, params) => ({ key, type: StepTypes.Form, ...params }),
};
