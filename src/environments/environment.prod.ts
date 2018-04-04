import {EnvironmentBase} from './environment-base';

export const environment = new EnvironmentBase({
    production: true,
    resources: {
        api: 'https://gibon.i.cz/cgi-bin/aps_cacheWEB.sh'
    }
});
