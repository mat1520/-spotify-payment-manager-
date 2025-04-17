// Configuración principal de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de la aplicación
    console.log('Aplicación iniciada');
});

// Exportar la configuración de Next.js si es necesario
if (typeof window !== 'undefined') {
    window.__NEXT_DATA__ = {
        props: {
            pageProps: {
                // Configuración de props
            }
        },
        isFallback: false,
        gssp: true,
        appGip: true,
        scriptLoader: []
    };
} 