import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Repository } from 'typeorm';
import { Category } from 'src/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {Message} from 'amqplib';

@Injectable()
export class CategorySyncService {
    
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>
    ){

    }

    //RabbitMQ - centenas milhares


    @RabbitSubscribe({
        exchange: 'amq.topic',
        routingKey: 'model.category.*',
        queue: 'micro-nestjs/category-sync'
    })
    async rpcHandler(data, message: Message){
        const action = this.getAction(message.fields.routingKey);
        switch(action){
            case 'created':
                const category = await this.categoryRepo.create(data);
                await this.categoryRepo.save(category);
                break;
            case 'updated':
                break;
            case 'deleted':
                break;
        }
        console.log(data)
        console.log(message.fields.routingKey);
    }

    protected getAction(routingKey){
        return routingKey.split('.')[2]
    }
}
