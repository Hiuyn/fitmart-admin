import axios from 'axios';

const changeProductHeader = { 'Content-Type': 'multipart/form-data' }

export const getAllProduct = (params) => {
  let remoteUrl = 'products'

  return axios.get(remoteUrl, {params: params})
}

export const createProduct = (data) => {
  let remoteUrl = 'products'

  return axios.post(remoteUrl, data)
}