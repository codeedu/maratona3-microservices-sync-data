from django.db.models.signals import post_save
from django.dispatch import receiver
from app.models import Category
from iniciando_com_django.celery import rabbitmq_producer

@receiver(post_save, sender=Category)
def category_sync(instance, created, **kwargs):
    action = 'created' if created else 'updated'
    routing_key = "model.category.%s" %(action)
    with rabbitmq_producer() as producer:
        producer.publish(
            body={
                'id': instance.id,
                'name': instance.name
            },
            routing_key=routing_key,
            exchange='amq.topic'
        )
