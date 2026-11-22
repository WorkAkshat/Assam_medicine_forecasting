import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Screen failed to render', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="panel max-w-md p-6">
          <h1 className="font-display text-lg text-ink-950">This screen could not be shown</h1>
          <p className="mt-1 text-sm text-slate-600">Your data on this device is unchanged. Reload to try again.</p>
          <pre className="mt-3 max-h-24 overflow-auto rounded bg-mist-100 p-2 text-[12px] text-slate-600">{String(this.state.error.message || this.state.error)}</pre>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => window.location.reload()} className="rounded-md bg-monsoon-600 px-3 py-1.5 text-sm text-white">Reload</button>
            <button type="button" onClick={() => { this.setState({ error: null }); window.location.assign('/'); }} className="rounded-md border border-mist-300 px-3 py-1.5 text-sm">Go to overview</button>
          </div>
        </div>
      </div>
    );
  }
}
