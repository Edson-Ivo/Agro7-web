import React, { Children, Fragment, cloneElement } from 'react';
import Pill from './Pill';
import Line from './Line';

export default function MultiStepForm({ children, activeStep, accentColor }) {
  return (
    <div style={styles.container}>
      <div style={styles.stepperContainer}>
        {React.Children.map(children, (child, i) => {
          if (i === Children.count(children) - 1)
            return (
              <>
                <Pill
                  active={activeStep === i + 1}
                  label={child.props.label}
                  complete={activeStep > i + 1}
                  accentColor={accentColor}
                  onClick={child.props.onClick}
                />
              </>
            );

          return (
            <>
              <Pill
                active={activeStep === i + 1}
                complete={activeStep > 1 && i + 1 < activeStep}
                label={child.props.label}
                accentColor={accentColor}
                onClick={child.props.onClick}
              />
              <Line
                complete={activeStep > 1 && i + 1 < activeStep}
                accentColor={accentColor}
              />
            </>
          );
        })}
      </div>
      {React.Children.map(children, (child, i) => {
        if (i + 1 === activeStep) return child;
        return cloneElement(child, { hidden: true });
      })}
    </div>
  );
}

const styles = {
  stepperContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: '0 auto',
    width: '70%',
    marginBottom: 40
  }
};
