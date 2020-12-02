import {config} from './config'
import fb from "firebase"
export const firebase = !fb.apps.length ? fb.initializeApp(config) : fb.app()
