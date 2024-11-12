import React, { useEffect } from 'react';

const Helmet = (props) => {
  useEffect(() => {
    document.title = "auto - " + props.title;
  }, [props.title]);

  return (
    <div>{props.children}</div>
  );
};

export default Helmet;
