import React from 'react';

interface ContentRowProps {
  label: string;
  content: React.ReactNode;
  suffix?: React.ReactNode;
}

export function ContentRow(props: ContentRowProps): React.ReactElement {
  const { label, content, suffix } = props;

  return (
    <div className='mb-2 flex items-center justify-between min-w-full'>
      <span>{label}</span>
      <div className='flex items-center'>
        {content}
        {suffix && <div className='ml-2 flex'>{suffix}</div>}
      </div>
    </div>
  );
}
