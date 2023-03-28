import { useEffect, useState } from 'react'

const getQueryParams = (search: string) => {
    const params = new URLSearchParams(search)
    const queryParams: Record<string, string> = {}
    for (const [key, value] of params.entries()) {
        queryParams[key] = value
    }
    return queryParams
}

const useQueryParams = () => {
    const [queryParams, setQueryParams] = useState(() => {
        const search = window.location.search
        return getQueryParams(search)
    })

    useEffect(() => {
        const onPopState = () => {
            const search = window.location.search
            setQueryParams(getQueryParams(search))
        }

        window.addEventListener('popstate', onPopState)
        return () => {
            window.removeEventListener('popstate', onPopState)
        }
    }, [])

    return queryParams
}

export default useQueryParams
