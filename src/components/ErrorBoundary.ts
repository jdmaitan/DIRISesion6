import logger from '../services/logger';
import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps
{
    fallback: ReactNode;
    children?: ReactNode;
}

interface ErrorBoundaryState
{
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState>
{
    constructor(props: ErrorBoundaryProps)
    {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): Partial<ErrorBoundaryState>
    {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo)
    {
        logger.warn(`Error capturado por ErrorBoundary: ${error.message}`);
        logger.debug(`Detalles del error: ${info.componentStack}`);
    }

    render(): ReactNode
    {
        if (this.state.hasError)
        {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;