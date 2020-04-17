import React from 'react';
import PropTypes from 'prop-types';

const Delayed = (props) => {
  const [hidden, setHidden] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setHidden(false);
    }, props.wait);
  }, []);

  return hidden ? '' : props.children;
};

Delayed.propTypes = {
  wait: PropTypes.number.isRequired,
};

export default Delayed;
