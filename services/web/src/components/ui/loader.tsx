import { Oval } from 'react-loader-spinner';
import { Colors } from '../../theme/colors';

export function Loader(): React.ReactElement {
  return (
    <Oval
      wrapperClass='h-full w-full items-center justify-center'
      height={25}
      width={25}
      color={Colors.primary}
    />
  );
}
