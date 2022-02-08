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
        'h-full w-full flex items-center justify-center',
        className
      )}
      height={30}
      width={30}
      strokeWidth={4}
      visible={visible}
      color={Colors.primary}
      secondaryColor={Colors.lightGray}
    />
  );
}
