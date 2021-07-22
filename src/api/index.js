import { get, post } from './http'

// //关于device的接口
// export const getAllDevice = (projectId) => get(`device/getAll?projectId=${projectId}`);
//
// export const handleAddDevice = (params) => get(`device/add`,params);

export const getAllAdmin = () => get('Admin/list')

export const handleUpdateAdmin = (params) => get('Admin/update', params)

export const handleAddAdmin = (params) => get('Admin/insert', params)

export const handleDeleteAdmin = (id) => get(`Admin/delete?id=${id}`)

export const getAllUser = () => get('User/list')

export const handleAddUser = (params) => get('User/insert', params)

export const handleDeleteUser = (id) => get(`User/delete?id=${id}`)

export const handleUpdateUser = (params) => get('User/update', params)

export const getAllFlight = () => get('Flight/list')

export const handleAddFlight = (params) => get('Flight/getFlightByJudge', params)

export const handleDeleteFlight = (id) => get(`Flight/delete?id=${id}`)

export const getAllTicket = () => get('Ticket/list')

export const handleUpdateTicket = (params) => get('Ticket/update', params)

export const handleDeleteTicket = (id) => get(`Ticket/delete?id=${id}`)

export const getAllData = () => get('getAllData')

export const getAllOrders = () => get('Orders/list')

export const handleDeletePassenger = (id) => get(`Passenger/delete?id=${id}`)

export const handleAddPassenger = (params) => get('Passenger/insert', params)

export const handleDeleteOrders = (id) => get(`Orders/delete?id=${id}`)

export const addPush = (id) => get(`addPush?id=${id}`)

export const getAllPush = () => get('getAllPush')

export const deletePush = (id) => get(`deletePush?id=${id}`)

export const handleAddNotice = (params) => get('Notice/insert', params)

export const getAllNotice = () => get('Notice/list')

export const handleUpdateNotice = (params) => get('Notice/update', params)

export const handleDeleteNotice = (id) => get(`Notice/delete?id=${id}`)

export const getChart = () => get('chart/getChart')

export const loginAdmin = (params) => get('Admin/login',params)
