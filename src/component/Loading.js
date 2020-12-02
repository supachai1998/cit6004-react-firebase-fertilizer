import React from 'react';
import {Button,Spinner} from 'react-bootstrap'
const Loading = () => {
    return (
      <>
        <Button variant="primary" disabled className="w-100">
        <Spinner animation="border" role="status">
  <span className="sr-only">...</span>
</Spinner>
        Loadding...
        </Button>{" "}
      </>
    );
  };

export default Loading;
