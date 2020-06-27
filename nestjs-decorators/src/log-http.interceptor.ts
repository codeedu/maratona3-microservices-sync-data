import {CallHandler, ExecutionContext, Injectable, NestInterceptor, SetMetadata} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";
import {tap} from "rxjs/operators";
import {Request} from 'express';
import {ServerResponse} from "http";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";

export const LogHttp = () => SetMetadata('log-http', true);
export const Decorator1 = (obj) => SetMetadata('decorator1', obj);

@Injectable()
export class LogHttpInterceptor implements NestInterceptor {

    constructor(
        private reflector: Reflector,
        private amqpConn: AmqpConnection
    ) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request: Request = context.switchToHttp().getRequest();
        //const info = this.reflector.get('log-http', context.getHandler());
        console.log('log-http-interceptor')
        return next
            .handle()
            .pipe(
                tap(responseData => {
                    if(this.hasDecorator(context)) {
                        const response: ServerResponse = context.switchToHttp().getResponse();
                        this.publish(
                            request,
                            {
                                data: responseData,
                                statusCode: response.statusCode
                            }
                        )
                    }
                })
            )
            ;
    }

    hasDecorator(context: ExecutionContext) {
        const hasInClass = this.reflector.get('log-http', context.getClass());
        const hasInAction = this.reflector.get('log-http', context.getHandler());
        console.log(hasInClass, hasInAction);
        return hasInClass || hasInAction
    }

    publish(request: Request, {data, statusCode}) {
        this.amqpConn.publish(
            'amq.direct',
            'log-http',
            {
                request: {
                    path: request.url,
                    queryString: request.query,
                    body: request.body
                },
                response: {
                    data,
                    statusCode
                }
            }
        );
    }
}
