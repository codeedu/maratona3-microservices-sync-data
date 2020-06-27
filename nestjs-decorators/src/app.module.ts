import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CategoryController} from './category/category.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {Category} from "./category.entity";
import {CategoryModule} from './category/category.module';
import {APP_INTERCEPTOR} from "@nestjs/core";
import {LogHttpInterceptor} from "./log-http.interceptor";
import {MessageHandlerErrorBehavior, RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {LogHttpService} from './log-http/log-http.service';
import {LoggerServiceService} from './logger-service/logger-service.service';
import { CategorySyncService } from './category-sync/category-sync.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            // @ts-ignore
            type: process.env.TYPEORM_CONNECTION,
            host: process.env.TYPEORM_HOST,
            port: parseInt(process.env.TYPEORM_PORT),
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
            entities: [Category],
        }),
        TypeOrmModule.forFeature([Category]),
        RabbitMQModule.forRoot(RabbitMQModule, {
            uri: `amqp://admin:admin@rabbitmq:5672`,
            defaultRpcErrorBehavior: MessageHandlerErrorBehavior.ACK
        }),
        CategoryModule
    ],
    controllers: [AppController, CategoryController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: LogHttpInterceptor
        },
        LogHttpService,
        LoggerServiceService,
        CategorySyncService
    ],
})
export class AppModule {

}
