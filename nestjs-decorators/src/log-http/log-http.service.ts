import {Injectable} from '@nestjs/common';
import {Nack, RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import {LoggerServiceService} from "../logger-service/logger-service.service";

@Injectable()
export class LogHttpService {

    constructor(private logger: LoggerServiceService) {
    }

    @RabbitSubscribe({
        exchange: 'amq.direct',
        routingKey: 'log-http',
        queue: 'micro-nestjs/http'
    })
    async rpcHandler(message){
        this.logger.log(message);
        //background
    }
}
