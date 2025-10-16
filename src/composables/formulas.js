import {ref} from 'vue'

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

const isValidFormulas = (formulas) => {
    return formulas &&
        formulas.charm &&
        formulas.intimacy &&
        typeof formulas.charm.blueHadak === 'number' &&
        typeof formulas.charm.silverHairpin === 'number' &&
        typeof formulas.charm.chests === 'number' &&
        typeof formulas.charm.forage === 'number' &&
        typeof formulas.intimacy.ordos === 'number' &&
        typeof formulas.intimacy.sandalwoodBracelet === 'number' &&
        typeof formulas.intimacy.forage === 'number'
}


export function useFormulas() {

    const storageKey = 'formulaSettings'
    const saved = localStorage.getItem(storageKey)

    let initialFormulas = {...defaultFormulas}

    if (saved && saved !== 'undefined') {
        try {
            const parsed = JSON.parse(saved)
            if (isValidFormulas(parsed)) {
                initialFormulas = parsed
            } else {
                console.warn('Invalid formulas structure in localStorage, using defaults')
                localStorage.removeItem(storageKey) // удаляем некорректные данные
            }
        } catch (e) {
            console.warn('Error parsing formulas from localStorage:', e)
            localStorage.removeItem(storageKey)
        }
    }

    const formulas = ref(initialFormulas)

    const saveFormulas = (newFormulas) => {
        formulas.value = {...newFormulas}
        localStorage.setItem(storageKey, JSON.stringify(formulas.value))
    }

    const resetFormulas = () => {
        formulas.value = {...defaultFormulas}
        localStorage.removeItem(storageKey)
    }

    return {
        formulas,
        resetFormulas,
        saveFormulas,
        defaultFormulas
    }
}