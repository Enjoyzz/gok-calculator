import {ref} from "vue";

const defaultConcubines = ref(1)
const defaultCharmItems = ref({
    blueHadak: 0,
    whiteHadak: 0,
    goldHairpin: 0,
    silverHairpin: 0,
    perfume: 0,
    chests: 0,
    forage: 0
})
const defaultIntimacyItems = ref({
    ordos: 0,
    takya: 0,
    jadeBracelet: 0,
    sandalwoodBracelet: 0,
    goldEarrings: 0,
    gemRing: 0,
    loveLetter: 0,
    forage: 0
})

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

export {defaultFormulas, defaultIntimacyItems, defaultCharmItems, defaultConcubines}