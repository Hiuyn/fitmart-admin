import axios from 'axios';

export const getAllProduct = (params) => {
  let remoteUrl = 'products'

  return axios.get(remoteUrl, {params: params})
}

export const getProductVariants = (id, params) => {
  let remoteUrl = `products/${id}/variants`

  return axios.get(remoteUrl, {params: params})
}

export const getAllProductOptions = (id, params) => {
  let remoteUrl = `products/${id}/options`

  return axios.get(remoteUrl, {params: params})
}

export const getProduct = (id) => {
  let remoteUrl = `products/${id}`

  return axios.get(remoteUrl)
}

export const createProduct = (data) => {
  let remoteUrl = 'products'

  return axios.post(remoteUrl, data)
}

export const updateProduct = (id, data) => {
  let remoteUrl = `products/${id}`

  return axios.put(remoteUrl, data)
}