import { defineStore } from 'pinia'

const petsRawKey = 'pets'

export const usePetsStore = defineStore('pets', {
  state: () => ({
    petsRaw: localStorage.getItem(petsRawKey) || '[]',
  }),

  getters: {
    pets: (state) => {
      try {
        return JSON.parse(state.petsRaw)
      } catch (e) {
        console.error(e)
        return []
      }
    },
  },

  actions: {
    addPet(pet) {
      const next = [...this.pets, {
        id: crypto.randomUUID(),
        type: pet.type,
        action: pet.action,
        currentLevel: pet.action === 'level-up' ? pet.currentLevel : null,
        desiredLevel: pet.action === 'level-up' ? pet.desiredLevel : null,
      }]
      this.setPets(next)
    },

    updatePet(id, patch) {
      const next = this.pets.map(p => {
        if (p.id !== id) return p
        return {
          ...p,
          type: patch.type,
          action: patch.action,
          currentLevel: patch.action === 'level-up' ? patch.currentLevel : null,
          desiredLevel: patch.action === 'level-up' ? patch.desiredLevel : null,
        }
      })
      this.setPets(next)
    },

    removePet(id) {
      this.setPets(this.pets.filter(p => p.id !== id))
    },

    setPets(newPets) {
      this.petsRaw = JSON.stringify(newPets)
      localStorage.setItem(petsRawKey, this.petsRaw)
    },

    clearPets() {
      this.petsRaw = '[]'
      localStorage.removeItem(petsRawKey)
    },
  },
})
