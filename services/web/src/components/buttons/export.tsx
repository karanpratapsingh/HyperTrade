import { Tooltip } from 'antd';
import map from 'lodash/map';
import { CSVLink } from 'react-csv';
import { RiShareBoxLine } from 'react-icons/ri';
import { Trade } from '../../api/trades';
import { DataFrameEventPayload } from '../../events/types';

type DataType = 'dataframe' | 'trades';

interface ExportButtonProps {
  type: DataType;
  data: DataFrameEventPayload[] | Trade[];
}

export function ExportButton(props: ExportButtonProps): React.ReactElement {
  const { type, data } = props;

  let csv = [];

  switch (type) {
    case 'dataframe':
      csv = normalizeDataFrame(data as DataFrameEventPayload[]);
      break;

    case 'trades':
      csv = data;
      break;
  }

  return (
    <Tooltip title='Export CSV' placement='bottomRight'>
      <div className='mt-2'>
        <CSVLink filename={type} data={csv} enclosingCharacter='' target='_blank'>
          <RiShareBoxLine size={20} />
        </CSVLink>
      </div>
    </Tooltip>
  );
}

function normalizeDataFrame(dataframe: DataFrameEventPayload[]) {
  function iteratee(dataframe: DataFrameEventPayload) {
    const { signal } = dataframe;

    return {
      ...dataframe.kline,
      ...dataframe.indicators,
      signal,
    };
  }

  return map(dataframe, iteratee);
}
