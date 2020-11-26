import dayjs from 'dayjs'
import { VedtakSuperContainer } from '../reducers/vedtak';


export const erHelg = (dato: Date) => {
    return dato.getDay() === 6 || dato.getDay() === 0
}

export const estimertMaksdato = (vedtak: VedtakSuperContainer) => {
    let slutt = dayjs(vedtak!.vedtak.tom)
    let x = 0
    while (x < vedtak.vedtak.gjenståendeSykedager) {
        slutt = slutt.add(1, 'day')
        while (erHelg(slutt.toDate())) {
            slutt = slutt.add(1, 'day')
        }
        x++
    }
    return slutt.format('DD.MM.YYYY')
}
