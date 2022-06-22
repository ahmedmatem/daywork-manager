import { environment } from '../environments/environment'

export const DAYS_IN_DATE_RANGE: number = 13 // two weeks

export const API_KEY: string = environment.firebaseApiKey

// Firebise auth rest api urls
export const SIGN_IN_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`

// Data storage keys
export const KEY_WORKERS_IDS: string = "workers_ids"
export const KEY_DAYWORKS = "dw"

export const DB_URL = 'https://daywork-manager-default-rtdb.europe-west1.firebasedatabase.app/'

export const PAYDAY_ANCHOR = new Date(2022, 4, 20) //Fri Jun 03 2022 00:00:00 GMT+0100 
