export type Rates = {
    cutoffs: {
        card: Array<number>,
        slab: Array<number>,
        sealed: Array<number>
    },
    cashRates: {
        card: Array<number>,
        slab: Array<number>,
        sealed: Array<number>
    },
    creditRates: {
        card: Array<number>,
        slab: Array<number>,
        sealed: Array<number>
    }
}