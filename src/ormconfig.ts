import * as ormconfig from '../ormconfig.json';

const setupOrmConfig = () => {    
    (global as any).ormconfig = {
        ...ormconfig,
        host : process.env.HOST,
        database : process.env.DB,
        password : process.env.PASSWORD,
        username : process.env.USER
    }
}

export default setupOrmConfig;
