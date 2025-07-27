import { useEffect, useState } from 'react';


export function useFetch(url) {

    const [data, setData] = useState(null);

    // el siguiente estado se encargara cuando se esta cargando la informacion
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        // para que no se ejecute mas de una vez
        setLoading(true);
        
        // hacemos la peticion a la API
      fetch(url, { signal: abortController.signal }) // pasamos la señal de abortar, para que no se ejecute mas de una vez
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => setError(error))
        .finally(() => setLoading(false));

        //return () => abortController.abort(); // limpiamos el efecto para que no se ejecute mas de una vez
    }, []);

    return {data, loading, error};

}

