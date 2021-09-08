import React from 'react';
import { Chart as ChartDefaults, Bar, Pie, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useMediaQuery } from 'react-responsive';

import { ChartContainer, ChartTitle } from './styles';

const Chart = ({
  ref = null,
  type = '',
  title = '',
  width = 500,
  height = 500,
  mobileHeight = 380,
  dataValues = [],
  dataLabels = [],
  dataColors = [],
  dataBorderColor = '',
  labelPrefix = '',
  labelSuffix = '',
  legendActive = true,
  dataLabelsActive = false,
  animation = true,
  onClick = () => {},
  ...rest
}) => {
  if (dataLabelsActive) ChartDefaults.register(ChartDataLabels);

  const isMobile = useMediaQuery({ maxWidth: 800 });
  const adaptativeHeight = !isMobile ? height : mobileHeight;

  const lineOptions =
    type === 'line'
      ? {
          borderColor: dataBorderColor,
          borderWidth: 2,
          fill: true,
          tension: 0
        }
      : {};

  const data = {
    labels: dataLabels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: dataColors,
        hoverOffset: 4,
        ...lineOptions
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    onClick,
    animation,
    plugins: {
      datalabels: {
        display: dataLabelsActive,
        color: 'white',
        font: {
          size: !isMobile ? 14 : 12
        },
        formatter: (...args) => args[1].chart.data.labels[args[1].dataIndex]
      },
      tooltip: {
        callbacks: {
          label: tooltipItem =>
            ` ${tooltipItem?.label}: ${labelPrefix}${
              tooltipItem?.formattedValue || ''
            }${labelSuffix}`
        }
      },
      legend: { display: legendActive }
    }
  };

  return (
    <>
      {title && <ChartTitle>{title}</ChartTitle>}
      <ChartContainer height={adaptativeHeight}>
        {(type === 'bar' && (
          <Bar
            ref={ref}
            width={width}
            height={adaptativeHeight}
            data={data}
            options={options}
            {...rest}
          />
        )) ||
          (type === 'pie' && (
            <Pie
              ref={ref}
              width={width}
              height={adaptativeHeight}
              data={data}
              options={options}
              {...rest}
            />
          )) ||
          (type === 'line' && (
            <Line
              ref={ref}
              width={width}
              height={adaptativeHeight}
              data={data}
              options={options}
              {...rest}
            />
          ))}
      </ChartContainer>
    </>
  );
};

export default Chart;
