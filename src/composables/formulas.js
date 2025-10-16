import { ref, watch } from 'vue'

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
    const formulas = ref(saved ? JSON.parse(saved) : { ...defaultFormulas })

    watch(formulas, (newFormulas) => {
        localStorage.setItem(storageKey, JSON.stringify(newFormulas))
    }, { deep: true })

    const updateFormulas = (newFormulas) => {
        formulas.value = newFormulas
    }

    const resetFormulas = () => {
        formulas.value = { ...defaultFormulas }
        localStorage.removeItem(storageKey)
    }

    return {
        formulas,
        updateFormulas,
        resetFormulas,
        defaultFormulas
    }
}