import {EnvironmentBase} from './environment-base';

export const environment = new EnvironmentBase({
    production: true,

    resources: {
        api: location.origin + '/rest'
    }
});
