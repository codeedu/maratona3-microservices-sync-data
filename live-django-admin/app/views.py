from django.forms import ModelForm
from django.shortcuts import render, redirect

# Create your views here.
from app.models import Category
from iniciando_com_django.celery import rabbitmq_producer

def category_list(request):
    with rabbitmq_producer() as producer:
        producer.publish(
            body={'id': 'teste'},
            routing_key='teste',
            exchange='amq.direct'
        )
    categories = Category.objects.all()
    return render(
        request,
        'category_list.html',
        {
            'categories': categories
        }
    )

class CategoryForm(ModelForm):
    class Meta:
        model = Category
        fields = ['name']

def category_create(request):
    form = CategoryForm(request.POST or None)

    if form.is_valid():
        form.save()
        return redirect('/category_list')

    return render(
        request,
        'category_create.html',
        {
            'form': form
        }
    )