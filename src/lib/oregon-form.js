import { Fields, Steps } from './helpers';

export default {
  steps: [
    Steps.Form('drugName', {
      heading: 'What is the name of the drug?',
      fields: [Fields.Autocomplete('drugName')],
    }),
    Steps.Form('forSaleInUS', {
      heading: 'Is this a new prescription drug for sale in the United States?',
      fields: [
        Fields.Radio(
          'forSaleInUS',
          [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
          {
            helpText: `
              New prescription drug means a prescription drug that has received initial approval under an original new drug application under 21 U.S.C. 355(j), or under a biologics license under 42 U.S.C. 262. In cases where multiple products are included on an application, the Department considers each product a new prescription drug (OAR 836-200-0505).
          `,
          }
        ),
      ],
    }),
    Steps.Decision('', obligationTest),
    Steps.Form('drugCost', {
      heading: `
        What is the whole sale acquisition cost of the drug of a one-month supply or for a course of treatment lasting less than one month?
      `,
      fields: [
        Fields.Text('drugCost', {
          helpText: `
            Wholesale acquisition cost means the list price for the drug to wholesalers or direct purchasers in the United States, not including prompt pay or other discounts, rebates or reductions in price, for the most recent month for which the information is available, as reported in wholesale price guides or other publications of drug pricing data (42 U.S.C. 1395w-3a(c)(6)(B)).
            <br/><br/>
            One-month supply means the total daily dosage units of a prescription drug recommended by its prescribing label as approved by the federal Food and Drug Administration for 30 days. If there is more than one such recommended daily dosage, the Department will consider the largest recommended daily dosage for the purposes of determining a one-month supply.
            <br/><br/>
            Course of treatment means the total dosage of a drug that would be prescribed in a single prescription to a patient taking the drug as recommended by its prescribing label as approved by the federal Food and Drug Administration. If there is more than one such recommended dosage, the Department will consider the largest recommended total dosage for the purposes of determining a course of treatment.
          `,
        }),
      ],
    }),
    Steps.Decision('', formData => formData.drugCost <= 670 && 'drugInOregonDatabase'),
    Steps.Form('introDate', {
      heading: 'Date the new prescription drug was or will be introduced',
      fields: [Fields.Date('introDate')],
    }),
    Steps.Form('introName', {
      heading: `
        The full trade, chemical, or biologic product name of the drug, or recognized industry standard drug identification information for the drug as specified on the Department’s website
      `,
      fields: [Fields.Autocomplete('introName')],
    }),
    Steps.Form('introReminder', {
      heading: `
        You must notify the Oregon Division of Financial Regulation of the introduction of your drug.
      `,
      description: `
        No later than 30 days after the new prescription drug is introduced for sale in the United States, you must notify the Oregon Division of Financial Regulation, See the <a href="https://dfr.oregon.gov/drugtransparency/Pages/manufacturers.aspx" target="_blank" rel="noopener noreferrer">Oregon Prescription Drug Price Transparency Reporting</a> website for more information on reporting requirements.
      `,
      fields: [
        Fields.Email('email', {
          label: 'Enter your email to receive an email reminder 29 days prior to the deadline.',
          optional: true,
        }),
      ],
    }),
    Steps.Form('drugInOregonDatabase', {
      heading: 'Is the drug sold or going to be sold in Oregon?',
      fields: [
        Fields.Radio('forSaleInOregon', [
          { label: 'Yes', value: 'Yes' },
          { label: 'No', value: 'No' },
        ]),
      ],
    }),
    Steps.Decision('', formData => {
      if (formData.drugNameInItems || formData.forSaleInOregon) {
        return formData.drugCost && 'isMediumCost';
      } else {
        return 'requestInfo';
      }
    }),
    Steps.Form('drugCost2', {
      heading: `
        What is the whole sale acquisition cost of the drug of a one-month supply or for a course of treatment lasting less than one month?
      `,
      fields: [
        Fields.Text('drugCost', {
          helpText: `
            Wholesale acquisition cost means the list price for the drug to wholesalers or direct purchasers in the United States, not including prompt pay or other discounts, rebates or reductions in price, for the most recent month for which the information is available, as reported in wholesale price guides or other publications of drug pricing data (42 U.S.C. 1395w-3a(c)(6)(B)).
            
            One-month supply means the total daily dosage units of a prescription drug recommended by its prescribing label as approved by the federal Food and Drug Administration for 30 days. If there is more than one such recommended daily dosage, the Department will consider the largest recommended daily dosage for the purposes of determining a one-month supply.
            
            Course of treatment means the total dosage of a drug that would be prescribed in a single prescription to a patient taking the drug as recommended by its prescribing label as approved by the federal Food and Drug Administration. If there is more than one such recommended dosage, the Department will consider the largest recommended total dosage for the purposes of determining a course of treatment.
          `,
        }),
      ],
    }),
    Steps.Decision('isMediumCost', formData => formData.drugCost < 100 && 'requestInfo'),
    Steps.Form('costCalc', {
      heading: 'What is the net yearly increase in the drug cost over the last 2 years?',
      fields: [
        Fields.Text('netCostIncrease', {
          helpText: `
          The year over year increase in the average cost of drug. This can be calculated by dividing the current year's average cost by the previous year's then subtracting 1.
        `,
        }),
      ],
    }),
    Steps.Decision('', formData => formData.netCostIncrease < 0.1 && 'requestInfo'),
    Steps.Form('requestInfo', {
      heading: `
        You must submit a report to the Department of Consumer and Business Services.
      `,
      description: `
        For more information on submitting this report, <a href="/" target="_blank" rel="noopener noreferrer">click here</a>.
        <br/>
        <br/>
        After receiving the report or information you have entered, the Department of Consumer and Business Services may make a written request.
      `,
      fields: [
        Fields.Email('email2', {
          label: 'Enter your email to receive an email reminder 29 days prior to the deadline.',
          optional: true,
        }),
      ],
    }),
    Steps.Form('', {
      heading: 'Thanks, you are all set!',
      description: `
        The Department may not post to its website any information above if:
          <br/>  1. The information is conditional exempt from disclosure as a trade-secret.
          <br/>  2. The public interest does not require disclosure of the information.
          <br/><br/>
          You may be subject to a civil penalty, as provided in section 3 of this 2018 Act, for failure to comply with the expectations specified in (1)-(4) of this section may subject the manufacturer to a civil penalty under OAR 836-200-0560.
      `,
      final: true,
    }),
    Steps.Form('noObligation', {
      heading: `
        You have no obligation under the Oregon Prescription Drug Price Transparency Act to report drug prices, although other laws may apply.
      `,
      final: true,
    }),
  ],
};

function obligationTest(formData) {
  if (formData.forSaleInUS === 'No' && formData.drugNameInItems) {
    return 'drugInOregonDatabase';
  }
  if (formData.forSaleInUS === 'No' && !formData.drugNameInItems) {
    return 'noObligation';
  }
  return false;
}
