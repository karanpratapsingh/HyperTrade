import React from 'react';

export class ErrorBoundary extends React.Component {
  state: {
    error: Error | null;
    hasError: boolean;
  };

  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { error, hasError: true };
  }

  render() {
    const { error, hasError } = this.state;
    // TODO: make this nicer!
    if (error && hasError) {
      return <h1>Something went wrong.{error.message}</h1>;
    }

    return this.props.children;
  }
}
