interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header(props: HeaderProps) {
  const { title, subtitle } = props;

  return (
    <div className='flex flex-col pb-4'>
      <span className='font-bold text-xl'>{title}</span>
      {subtitle && <span className='italic text-gray-400'>{subtitle}</span>}
    </div>
  );
}
