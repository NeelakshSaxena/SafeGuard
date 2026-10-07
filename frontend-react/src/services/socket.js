import { io } from 'socket.io-client';
import { useStore } from '../store';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const initSocket = () => {
  socket.connect();

  socket.on('connect', () => {
    console.log('Connected to real-time tracking server');
  });

  socket.on('patient:update', (data) => {
    console.log('Real-time update received:', data);
    useStore.getState().updatePatientLocation(data.elder_id, data.lat, data.lng);
  });

  socket.on('alert:new', (alert) => {
    console.log('New alert received:', alert);
    useStore.getState().addAlert(alert);
  });
};
