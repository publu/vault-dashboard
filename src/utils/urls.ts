import _ from 'lodash/fp'

export const extractIPFSCID = (url: string) => {
    if (_.isEmpty(url)) return ''

    const structuredURLObject = new URL(url)
    const protocol: 'https:' | 'ipfs:' | string = structuredURLObject.protocol
    switch (protocol) {
        case 'https:':
            return structuredURLObject.pathname.split('/ipfs/').at(1)
        case 'ipfs:':
            return structuredURLObject.pathname.split('//').at(1)
        default:
            throw new Error(`Unknown protocol for ${url}`)
    }
}
