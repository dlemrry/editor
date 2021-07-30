
import socketIOClient from 'socket.io-client';

export const socket = socketIOClient("https://dglee95.com:8000", {secure: true});
export const host = "https://dglee95.com:8000";


