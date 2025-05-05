import service from '../utils/request'

export const joinRoomApi = (data) => {
  return service({
    url: '/api/join_room',
    method: 'post',
    data
  })
}
