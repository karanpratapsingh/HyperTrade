import { PageHeader } from 'antd';
import clsx from 'clsx';

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  extra?: React.ReactNode[];
}

export function Header(props: HeaderProps) {
  const { title, subtitle, className, extra } = props;

  const header: React.ReactNode = (
    <div className={clsx('flex flex-col mb-4', className)}>
      <span className='font-bold text-xl'>{title}</span>
      {subtitle && (
        <span className='text-sm font-light italic text-dark-gray'>
          {subtitle}
        </span>
      )}
    </div>
  );

  return <PageHeader className='p-0' title={header} extra={extra} />;
}
