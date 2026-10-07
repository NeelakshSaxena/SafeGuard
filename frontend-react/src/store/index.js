import { create } from 'zustand'

export const useStore = create((set) => ({
  elderlyPatients: [],
  alerts: [],
  isOffline: !navigator.onLine,
  
  setOfflineStatus: (status) => set({ isOffline: status }),
  
  setElderlyPatients: (patients) => set({ elderlyPatients: patients }),
  
  updatePatientLocation: (elder_id, lat, lng) => set((state) => ({
    elderlyPatients: state.elderlyPatients.map(p => 
      p.elder_id === elder_id ? { ...p, lat, lng } : p
    )
  })),

  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts]
  }))
}))
