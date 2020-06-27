# Standard Library
import os

import kombu
from celery import Celery, bootsteps
from celery import shared_task

app = Celery('celeryapp')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.pool.acquire()


def rabbitmq_conn():
    return app.pool.acquire(block=True)


def rabbitmq_producer():
    return app.producer_pool.acquire(block=True)