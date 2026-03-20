import React, { useState } from 'react';

function ErrorBoundary({ children }: any) {
    const [hasError, setHasError] = useState(false);

    const logErrorToMyService = (error: any, errorInfo: any) => {
        // Vous pouvez enregistrer l'erreur dans un service de rapport d'erreurs ici.
        console.error('Erreur capturée :', error, errorInfo);
    };

    const componentDidCatch = (error: any, errorInfo: any) => {
        setHasError(true);
        logErrorToMyService(error, errorInfo);
    };

    if (hasError) {
        // Affichez n'importe quelle interface de secours personnalisée ici.
        return <h1>Quelque chose s'est mal passé.</h1>;
    }

    return children;
}

export default ErrorBoundary;
