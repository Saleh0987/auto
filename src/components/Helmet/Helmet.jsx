import React, { useEffect } from 'react';

const Helmet = (props) => {
  useEffect(() => {
    document.title = "L'HABILLEUR - " + props.title;
  }, [props.title]);

  return (
    <div>{props.children}</div>
  );
};

export default Helmet;
