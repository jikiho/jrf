/**
 * "Pravnicka osoba" XML model.
 */
//TODO: prilohy, zmenove listy, string/number
import {Model} from '../model';

export class XmlModel extends Model<XmlModel> {
    Podani: PodaniModel;
}

/**
 * "Podani" model.
 */
class PodaniModel extends Model<PodaniModel> {
    $: {
        version: string,
        xmlns: string,
        'xmlns:ns2': string,
    };

    _: {
        AplikaceNazev: string,
        NovaOpravneniPO: OpravneniModel
    };
}

/**
 * "Stat" model.
 */
class StatModel extends Model<StatModel> {
    StatKod: string;

    StatNazev: string;
}

/**
 * "Adresa" model.
 */
class AdresaModel extends Model<AdresaModel> {
    AdresaPredavaciKod: string;

    StatKod: string;

    StatNazev: string;

    OkresKod: string;

    OkresNazev: string;

    ObecPredavaciKod: string;

    ObecNazev: string;

    CastObcePredavaciKod: string;

    CastObceNazev: string;

    CisloDomovniDruhKod: string;

    CisloDomovniHodnota: string;

    UliceNazev: string;

    CisloOrientacni: string;

    PSC: string;

    ObvodPrahaNazev: string;
}

/**
 * "Datum a misto" model.
 */
class DatumMistoModel extends Model<DatumMistoModel> {
    Misto: string;

    Datum: string; //YYYY-MM-DD

    Cas: string; //HH:MM:SS

    Jmeno: string;

    Prijmeni: string;

    PravnickaOsobaVztah: string;
}

/**
 * "Identifikace podnikatele" model.
 */
class PodnikatelIdModel extends Model<PodnikatelIdModel> {
    ObchodniJmeno: string;

    ICO: string;
}

/**
 * "Opravneni" model.
 */
class OpravneniModel extends Model<OpravneniModel> {
    ZakladniCastPO: {
        Podnikatel: PodnikatelModel,
        SidloAdresa: AdresaModel,
        //UkonyPoctyPriloh
        DatumMisto: DatumMistoModel
    };

    PredmetyPodnikani: PredmetyPodnikaniModel;

    OdpovedniZastupci: OdpovedniZastupciModel;
}

/**
 * "Podnikatel" model.
 */
class PodnikatelModel extends Model<PodnikatelModel> {
    ObchodniJmeno: string;

    ICO: string;

    PravniForma: {
        $: {
            kod: string
        },
        _: string
    };
}

/**
 * "Predmet podnikani" model.
 */
class PredmetPodnikaniModel extends Model<PredmetPodnikaniModel> {
    $: {
        kod: string
    };

    _: string;
}

/**
 * "Predmety podnikani" model.
 */
class PredmetyPodnikaniModel extends Model<PredmetyPodnikaniModel> {
    PodnikatelIdentifikace: PodnikatelIdModel;

    PredmetPodnikani: {
        $: {
            poradi: number
        },
        _: {
            PredmetPodnikani: PredmetPodnikaniModel
        }
    };

    DatumMisto: DatumMistoModel;
}

/**
 * "Odpovedny zastupce" model.
 * PredmetPodnikani -> PredmetPodnikaniModel.PredmetPodnikani.$.poradi
 */
class OdpovednyZastupceModel extends Model<OdpovednyZastupceModel> {
    OdpovednyZastupce: {
        Jmeno: string,
        Prijmeni: string,
        PrijmeniRodne: string,
        PohlaviKod: string,
        MistoNarozeni: string,
        MistoNarozeniOkres: string,
        MistoNarozeniStat: StatModel,
        NarozeniDatum: string, //YYYY-MM-DD
        StatniObcanstvi: StatModel,
        RodneCislo: string
    };

    BydlisteAdresa: AdresaModel;

    PredmetPodnikani: number
}

/**
 * "Odpovedni zastupci" model.
 */
class OdpovedniZastupciModel extends Model<OdpovedniZastupciModel> {
    PodnikatelIdentifikace: PodnikatelIdModel;

    OdpovednyZastupce: OdpovednyZastupceModel;

    DatumMisto: DatumMistoModel;
}
