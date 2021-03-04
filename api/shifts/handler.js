import axios from "axios";

import { baseUrl } from "./endpoints";

const createShift = (payload) => new Promise((resolve, reject)=>{
    return axios.post(`${baseUrl}/shifts/create`, payload)
    .then(response => {
        const result = response.data;
        resolve({
            meta: {
                status: "success",
                error: '',
            },
            data: result || {},
        })
    })
    .catch(error => {
        const errorData = error?.response?.data ?? {}
        reject(errorData)
    })
})


const getShift = () => new Promise((resolve, reject)=> {
    return axios.get(`${baseUrl}/shifts`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        const result = response?.data
        resolve({
            meta: {
                status: "success",
                error: '',
            },
            data: result || [],
        })
    })
    .catch(error => {
        const errorData = error?.response?.data ?? {}
        reject(errorData)
    })
})

const updateShift = (payload) => new Promise((resolve, reject)=> {
    return axios.put(`${baseUrl}/shifts/`, payload, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        const result = response.data;
        resolve({
            meta: {
                status: "success",
                error: '',
            },
            data: result || {},
        })
    })
    .catch(error => {
        const errorData = error?.response?.data ?? {}
        reject(errorData)
    })
})

const deleteShift = (payload) => new Promise((resolve, reject)=> {
    return axios.delete(`${baseUrl}/shifts`, {
        headers: {
            'Content-Type': 'application/json',
        },
        data: payload
    })
    .then(response => {
        const result = response.data;
        resolve({
            meta: {
                status: "success",
                error: '',
            },
            data: result || {},
        })
    })
    .catch(error => {
        const errorData = error?.response?.data ?? {}
        reject(errorData)
    })
})

export default {
   getShift,
   createShift,
   updateShift,
   deleteShift
}