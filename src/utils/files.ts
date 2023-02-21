export const saveTemplateAsJsonFile = (filename: string, dataObjToWrite: Object) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], {
        type: 'text/json',
    })
    const link = document.createElement('a')

    link.download = filename
    link.href = window.URL.createObjectURL(blob)
    link.dataset.downloadurl = ['text/json', link.download, link.href].join(':')

    const evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    })

    link.dispatchEvent(evt)
    link.remove()
}

export const saveTemplateAsCsvFile = (filename: string, dataRows: (string | null)[]) => {
    const blob = new Blob([dataRows.filter((s) => s).join('\n')], {
        type: 'text/csv',
    })
    const link = document.createElement('a')

    link.download = filename
    link.href = window.URL.createObjectURL(blob)
    link.dataset.downloadurl = ['text/csv', link.download, link.href].join(':')

    const evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    })

    link.dispatchEvent(evt)
    link.remove()
}
