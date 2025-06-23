import axios from 'axios';

export const getAllProductCategory = (params) => {
  let remoteUrl = 'product-categories'

  return axios.get(remoteUrl, {params: params})
}