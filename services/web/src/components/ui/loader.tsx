import clsx from 'clsx';
import { Oval } from 'react-loader-spinner';
import { Colors } from '../../theme/colors';

type Size = 'default' | 'small';

type Dimensions = {
  height: number;
  width: number;
};

interface LoaderProps {
  className?: string;
  size?: Size;
  visible?: boolean;
}

const sizes: Record<Size, Dimensions> = {
  default: { height: 30, width: 30 },
  small: { height: 20, width: 20 },
};

export function Loader(props: LoaderProps): React.ReactElement {
  const { className, size = 'default', visible = true } = props;

  return (
    <Oval
      wrapperClass={clsx(
        'h-full w-full flex items-center justify-center',
        className
      )}
      {...sizes[size]}
      strokeWidth={4}
      visible={visible}
      color={Colors.primary}
      secondaryColor={Colors.lightGray}
    />
  );
}
