import React, { Children, cloneElement } from 'react';
import { useMediaQuery } from 'react-responsive';

import Pill from './Pill';
import Line from './Line';

export default function MultiStepForm({
  children,
  activeStep,
  accentColor,
  onlyView = false
}) {
  const isMobile = useMediaQuery({ maxWidth: 800 });

  return (
    <div style={styles.container}>
      <div
        style={{ width: isMobile ? '90%' : '70%', ...styles.stepperContainer }}
      >
        {React.Children.map(children, (child, i) => {
          if (i === Children.count(children) - 1)
            return (
              <>
                <Pill
                  onlyView={onlyView}
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
                onlyView={onlyView}
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
    marginBottom: 40
  }
};
