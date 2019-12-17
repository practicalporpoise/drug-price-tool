const parse = require('csv-parse/lib/sync');
const fs = require('fs');

const INPUT_FILE = './formulary-single-col.csv';
const OUTPUT_FILE = './formulary-single-col.json';

const input = fs.readFileSync(INPUT_FILE);
const records = parse(input, { skip_empty_lines: true });
const output = transform(records);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output));

function transform(records) {
  return records
    .map(toSingleCol)
    .map(format)
    .filter(unique)
    .sort();
}

function toSingleCol(cols) {
  return cols[0];
}

function format(s) {
  return s
    .match(/[a-z,A-Z,0-9]*/)[0]
    .toLowerCase()
    .trim();
}

function unique(s, idx, ary) {
  return idx === ary.indexOf(s);
}
