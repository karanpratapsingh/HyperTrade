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

interface IndicatorLabelProps {
  name: string;
  description: string;
}

export function IndicatorLabel(props: IndicatorLabelProps): React.ReactElement {
  const { name, description } = props;

  return (
    <span className='ml-2 font-light'>
      {name}
      <span className='ml-1 italic font-light text-dark-gray'>
        ({description})
      </span>
    </span>
  );
}
