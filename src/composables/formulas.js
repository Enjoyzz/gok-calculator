import { ref } from 'vue'

const defaultFormulas = {
    charm: {
        blueHadak: 1.5,
        silverHairpin: 3,
        chests: 2.2,
        forage: 1.5
    },
    intimacy: {
        ordos: 1.5,
        sandalwoodBracelet: 3,
        forage: 1.2
    }
}

export function useFormulas() {
    const storageKey = 'formulaSettings'
    const saved = localStorage.getItem(storageKey)

    const formulas = ref(saved && saved !== 'undefined' ? JSON.parse(saved) : { ...defaultFormulas })

    const saveFormulas = (newFormulas) => {
        formulas.value = {...newFormulas.value}
        localStorage.setItem(storageKey, JSON.stringify(formulas.value))
    }

    const resetFormulas = () => {
        formulas.value = {...defaultFormulas.value}
        localStorage.removeItem(storageKey)
    }

    return {
        formulas,
        resetFormulas,
        saveFormulas,
        defaultFormulas
    }
}