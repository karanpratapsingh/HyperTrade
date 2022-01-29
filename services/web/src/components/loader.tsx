import { Oval } from 'react-loader-spinner';

export function Loader(): React.ReactElement {
  return (
    <Oval
      wrapperClass='h-full w-full items-center justify-center'
      height={40}
      width={40}
      color={'black'}
    />
  );
}
