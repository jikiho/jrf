/**
 * "Pravnicka osoba - Zivnosti" feature model.
 */
import {UtilsModule as utils} from '../utils.module';

export class ZivnostModel {
    state = {
        kodZivnosti: '',
        predmetPodnikani: ''
    };

    druhZivnosti = null;

    skupinaZivnosti = null;

    zivnost = null;

    oborCinnosti = null;

    /**
     * Transforms a model value for XML builder.
     */
    static xml(value: any): string {
        return '';
    }

    /**
     * Transforms XML parser result to a model value.
     */
    static value(result: any): any {
        const data = result.Podani.NovaOpravneniPO,
            items = utils.get(data, 'PredmetyPodnikani.PredmetPodnikani') || [];

        return {
            //zivnost: items.map((item) => item.PredmetPodnikani.$.kod)
        };
    }
}
