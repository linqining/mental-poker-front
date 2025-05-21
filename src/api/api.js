import service from '../utils/request'

export const reconnect = (address) => {
  return service({
    url: '/reconnect/'+address,
    method: 'get',
  })
}
