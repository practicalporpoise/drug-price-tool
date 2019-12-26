import { Fields } from '../../lib/helpers';
import c from './short-form-content.yml';

export default {
  drugName: {
    root: true,
    heading: c.drugName.heading,
    fields: [Fields.Autocomplete('drugName')],
    next: 'states',
  },
  states: {
    heading: c.states.heading,
    fields: [Fields.Autocomplete('states')],
    next: 'currentPriceRange',
  },
  currentPriceRange: {
    heading: c.currentPriceRange.heading,
    fields: [
      Fields.Text('currentPriceRangeHigh', { label: c.currentPriceRange.high }),
      Fields.Text('currentPriceRangeLow', { label: c.currentPriceRange.low }),
    ],
    next: 'patientAssistance',
  },
  previousPriceRange: {
    heading: c.previousPriceRange.heading,
    fields: [
      Fields.Text('previousPriceRangeHigh', { label: c.previousPriceRange.high }),
      Fields.Text('previousPriceRangeLow', { label: c.previousPriceRange.low }),
    ],
    next: 'patientAssistance',
  },
  patientAssistance: {
    heading: c.patientAssistance.heading,
    fields: [Fields.Radio('patientAssistance', c.patientAssistance.options)],
    next: formData => (formData.patientAssistance === 'Yes' ? 'patientAssistanceType' : 'exempt'),
  },
  patientAssistanceType: {
    heading: c.patientAssistanceType.heading,
    fields: [
      Fields.Radio('patientAssistanceType', c.patientAssistanceType.options, { other: true }),
    ],
    next: 'exempt',
  },
  exempt: {
    heading: c.exempt.heading,
    fields: [Fields.Radio('exempt', c.exempt.options)],
    next: 'determinationReceived',
  },
  determinationReceived: {
    heading: c.determinationReceived.heading,
    fields: [
      Fields.Radio('determinationReceived', c.determinationReceived.options, {
        other: true,
      }),
    ],
    next: 'alreadySubmitted',
  },
  alreadySubmitted: {
    heading: c.alreadySubmitted.heading,
    fields: [
      Fields.Radio('alreadySubmitted', c.alreadySubmitted.options, {
        other: true,
      }),
    ],
  },
};
