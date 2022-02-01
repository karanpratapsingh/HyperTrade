import clsx from 'clsx';
import { Oval } from 'react-loader-spinner';
import { Colors } from '../../theme/colors';

interface LoaderProps {
  className?: string;
  visible?: boolean;
}

export function Loader(props: LoaderProps): React.ReactElement {
  const { className, visible = true } = props;

  return (
    <Oval
      wrapperClass={clsx(
        'h-full w-full items-center justify-center',
        className
      )}
      height={25}
      width={25}
      strokeWidth={4}
      visible={visible}
      color={Colors.primary}
      secondaryColor={Colors.lightGray}
    />
  );
}
