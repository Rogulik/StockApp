import React,{useContext} from 'react'
import { connect } from 'react-redux'
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { setToggleSort } from '../../../actions/toggleSort';
import Button from 'react-bootstrap/Button'

const ContextAwareToggle = ({
    eventKey,
    callback,
    setToggleSort,
    toggleSort,
    children,
    buttonStyle,
    type,
  }) => {
    const currentEventKey = useContext(AccordionContext);
    
    const secondaryOnClick = useAccordionToggle(eventKey, () => {
      setToggleSort();
      return callback && callback(eventKey);
    });
  
    const isCurrentEventKey = currentEventKey === eventKey;
  
    return (
      <Button
        size="sm"
        type={type}
        variant={ buttonStyle ? buttonStyle : isCurrentEventKey ? 'outline-secondary' : 'outline-primary'}
        onClick={secondaryOnClick}
        disabled={currentEventKey !== eventKey && toggleSort}
      >
        {children}
      </Button>
    );
  };
  
  const ConnectedContextAwareToggle = connect(
    (state) => ({
      toggleSort: state.toggleSort,
    }),
    { setToggleSort },
  )(ContextAwareToggle);

export default ConnectedContextAwareToggle
