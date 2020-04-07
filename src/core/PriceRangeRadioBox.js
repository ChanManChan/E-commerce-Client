import React from 'react';
import { withStyles, Radio, FormControlLabel } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

const CustomRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color='default' {...props} />);

const PriceRangeRadioBox = ({ prices }) => {
  return prices.map((p, i) => (
    <div key={i}>
      <FormControlLabel
        value={`${p._id}`}
        control={<CustomRadio />}
        label={p.name}
      />
    </div>
  ));
};

export default PriceRangeRadioBox;
