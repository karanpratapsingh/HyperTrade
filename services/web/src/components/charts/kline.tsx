import { Chart, dispose, init, KLineData } from 'klinecharts';
import { map } from 'lodash';
import React, { useEffect } from 'react';
import { useDataFrame } from '../../store/dataframe';

const CHART_ID = 'kline-chart';

export function KlineChart(): React.ReactElement {
  useEffect(() => {
    const chart: Chart | null = init(CHART_ID, {
      candle: {
        tooltip: {
          labels: ['T: ', 'O: ', 'C: ', 'H: ', 'O: ', 'V: '],
        },
      },
      technicalIndicator: {
        lastValueMark: {
          show: true,
          text: {
            show: true
          }
        }
      }
    });

    const unsubscribe = useDataFrame.subscribe(({ data }) => {
      const klineData: KLineData[] = map(
        data,
        ({ kline: { open, close, high, low, volume, time } }) => ({
          open,
          close,
          high,
          low,
          volume,
          timestamp: time,
        })
      );
      chart?.applyNewData(klineData);
    });

    return () => {
      dispose(CHART_ID);
      unsubscribe();
    };
  }, []);

  return <div id={CHART_ID} style={{ height: 600 }}></div>;
}
