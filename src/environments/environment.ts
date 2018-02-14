import {EnvironmentBase} from './environment-base';

export const environment = new EnvironmentBase({
    resources: {
        //api: 'http://localhost/info.php'
        api: 'https://gibon.i.cz/cgi-bin/aps_cacheWEB.sh'
    }
});
