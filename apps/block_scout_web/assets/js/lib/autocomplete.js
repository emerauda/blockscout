import AutoComplete from '@tarekraafat/autocomplete.js/dist/autoComplete.js'

const placeHolder = 'Search by address, token symbol, name, transaction hash, or block number'
const dataSrc = async (query, id) => {
  try {
    // Loading placeholder text
    const searchInput = document
      .getElementById(id)

    searchInput.setAttribute('placeholder', 'Loading...')

    // Fetch External Data Source
    const source = await fetch(
      `/token-autocomplete?q=${query}`
    )
    const data = await source.json()
    // Post Loading placeholder text

    searchInput.setAttribute('placeholder', placeHolder)
    // Returns Fetched data
    return data
  } catch (error) {
    return error
  }
}
const resultsListElement = (list, data) => {
  const info = document.createElement('p')
  if (data.results.length > 0) {
    info.innerHTML = `Displaying <strong>${data.results.length}</strong> results`
  }

  list.prepend(info)
}
const searchEngine = (query, record) => {
  if (record.name.toLowerCase().includes(query.toLowerCase()) ||
        record.symbol.toLowerCase().includes(query.toLowerCase()) ||
        record.contract_address_hash.toLowerCase().includes(query.toLowerCase())) {
    var searchResult = `${record.contract_address_hash}<br/><b>${record.name}</b>`
    if (record.symbol) {
      searchResult = searchResult + ` (${record.symbol})`
    }
    if (record.holder_count) {
      searchResult = searchResult + ` <i>${record.holder_count} holder(s)</i>`
    }
    var re = new RegExp(query, 'ig')
    searchResult = searchResult.replace(re, '<mark class=\'autoComplete_highlight\'>$&</mark>')
    return searchResult
  }
}
const resultItemElement = (item, data) => {
  // Modify Results Item Style
  item.style = 'display: flex; justify-content: space-between;'
  // Modify Results Item Content
  item.innerHTML = `
  <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
    ${data.match}
  </span>`
}
const config = (id) => {
  return {
    selector: `#${id}`,
    data: {
      src: (query) => dataSrc(query, id),
      cache: false
    },
    placeHolder: placeHolder,
    searchEngine: (query, record) => searchEngine(query, record),
    resultsList: {
      element: (list, data) => resultsListElement(list, data),
      threshold: 2,
      noResults: true,
      maxResults: 100,
      tabSelect: true
    },
    resultItem: {
      element: (item, data) => resultItemElement(item, data),
      highlight: 'autoComplete_highlight'
    },
    events: {
      input: {
        focus: () => {
          if (autoCompleteJS.input.value.length) autoCompleteJS.start()
        }
      }
    }
  }
}
const autoCompleteJS = new AutoComplete(config('main-search-autocomplete'))
// eslint-disable-next-line
const _autoCompleteJSMobile = new AutoComplete(config('main-search-autocomplete-mobile'))

const selection = (event) => {
  const selectionValue = event.detail.selection.value

  if (selectionValue.symbol) {
    window.location = `/tokens/${selectionValue.contract_address_hash}`
  } else {
    window.location = `/address/${selectionValue.contract_address_hash}`
  }
}

document.querySelector('#main-search-autocomplete').addEventListener('selection', function (event) {
  selection(event)
})
document.querySelector('#main-search-autocomplete-mobile').addEventListener('selection', function (event) {
  selection(event)
})
