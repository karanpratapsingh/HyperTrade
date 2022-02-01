import clsx from 'clsx';

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function Header(props: HeaderProps) {
  const { title, subtitle, className } = props;

  return (
    <div className={clsx('flex flex-col', className)}>
      <span className='font-bold text-xl'>{title}</span>
      {subtitle && (
        <span className='text-sm font-light italic text-gray-400'>
          {subtitle}
        </span>
      )}
    </div>
  );
}
