import { FieldTypes } from './constants';

export const Fields = {
  Autocomplete: (name, params) => ({ name, type: FieldTypes.Autocomplete, ...params }),
  Date: (name, params) => ({ name, type: FieldTypes.Date, ...params }),
  Email: (name, params) => ({ name, type: FieldTypes.Email, ...params }),
  Radio: (name, options, params) => ({ name, type: FieldTypes.Radio, options, ...params }),
  Text: (name, params) => ({ name, type: FieldTypes.Text, ...params }),
};
