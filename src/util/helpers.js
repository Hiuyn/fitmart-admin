export const jsonToFormData = (json, formData, parentKey = '') => {
  for (let key in json) {
    if (json.hasOwnProperty(key)) {
      let nestedKey = parentKey ? `${parentKey}[${key}]` : key

      if (Array.isArray(json[key]) && json[key].length === 0) {
        formData.append(`${nestedKey}[]`, '')
      } else if (typeof json[key] === 'object' && !(json[key] instanceof File)) {
        jsonToFormData(json[key], formData, nestedKey)
      } else {
        formData.append(nestedKey, json[key])
      }
    }
  }
}