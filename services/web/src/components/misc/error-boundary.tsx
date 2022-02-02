import { Result } from 'antd';
import React from 'react';

interface ErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

export class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState = {
    error: null,
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      error,
      hasError: true,
    };
  }

  render(): React.ReactNode {
    const { error, hasError } = this.state;
    const { children } = this.props;

    if (error && hasError) {
      return (
        <div className='flex flex-1 items-center justify-center'>
          <Result
            status='warning'
            title='Something went wrong'
            subTitle={error?.message}
          />
        </div>
      );
    }

    return children;
  }
}
