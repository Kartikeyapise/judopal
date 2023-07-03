import { Logger } from "@nestjs/common";
import { DataSource, createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const DbConnectionService = {
    provide: 'Connection',
    inject: [],
    useFactory: () => {
        const ormConfigDetail = (global as any).ormconfig;
        const commonEntities = ormConfigDetail.entities;
        createConnectionPool(ormConfigDetail, commonEntities);
    }
};

async function createConnectionPool(ormConfigDetail: any, commonEntities: any) {
    const finalConfig = {
        ...ormConfigDetail,
        entities: [...commonEntities],
        extra: {
            connectionLimit: 100,
        },
    };
    (global as any).dbConnectionPool = await createConnection(finalConfig as PostgresConnectionOptions);
    Logger.log(`Db Connected : ${(global as any).dbConnectionPool.isInitialized}`);
}