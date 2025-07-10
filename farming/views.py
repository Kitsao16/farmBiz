from django.contrib import messages
from django.core.cache import cache
from django.core.paginator import Paginator
from django.db.models import Avg, Q
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Farmer, FarmingActivity, Business, Incentive, Review, Collaboration
from .serializers import BusinessSerializer
from .filters import BusinessFilter
from .utils import get_weather


def home(request):
    return HttpResponse("Welcome to the FarmBiz Home Page!")


def custom_404(request, exception):
    return HttpResponse("Page not found", status=404)


def custom_500(request):
    return HttpResponse("Internal server error", status=500)


@csrf_exempt
def create_business(request):
    if request.method == 'POST':
        data = request.POST
        farmer_id = data.get('farmer_id')
        name = data.get('name')
        description = data.get('description')
        contact_info = data.get('contact_info')
        category = data.get('category')
        products_services = data.get('products_services')

        try:
            farmer = get_object_or_404(Farmer, id=farmer_id)
            business = Business(
                farmer=farmer,
                name=name,
                description=description,
                contact_info=contact_info,
                category=category,
                products_services=products_services,
                image=request.FILES.get('image')
            )
            business.save()
            messages.success(request, 'Business created successfully')
            return JsonResponse({'message': 'Business created successfully'}, status=201)
        except Farmer.DoesNotExist:
            messages.error(request, 'Farmer not found')
            return JsonResponse({'error': 'Farmer not found'}, status=404)
    messages.error(request, 'Invalid request method')
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def list_businesses(request):
    query = request.GET.get('q', '').strip()  # Get search query
    category = request.GET.get('category')  # Get category filter
    page_number = request.GET.get('page', 1)  # Get page number, default to 1
    cache_key = f'business_search_{query}_{category}_{page_number}'
    results = cache.get(cache_key)

    if not results:
        # Apply search and filter logic using Q objects
        businesses = Business.objects.all()
        if query:
            businesses = businesses.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(location__icontains=query) |
                Q(category__icontains=query)
            )
        if category:
            businesses = businesses.filter(category=category)

        # Paginate the results
        paginator = Paginator(businesses, 10)  # Show 10 businesses per page
        page_obj = paginator.get_page(page_number)

        results = {
            "businesses": [
                {
                    "name": business.name,
                    "description": business.description,
                    "contact_info": business.contact_info,
                    "category": business.category,
                    "products_services": business.products_services,
                    "image_url": business.image.url if business.image else None,
                    "farmer": business.farmer.name,
                    "average_rating": business.reviews.aggregate(Avg('rating'))['rating__avg'],
                } for business in page_obj
            ],
            "pagination": {
                "current_page": page_obj.number,
                "total_pages": paginator.num_pages,
                "has_previous": page_obj.has_previous(),
                "has_next": page_obj.has_next(),
            }
        }
        cache.set(cache_key, results, timeout=60 * 15)  # Cache for 15 minutes

    return JsonResponse(results, safe=False)


@csrf_exempt
def add_review(request):
    if request.method == 'POST':
        data = request.POST
        user_id = data.get('user_id')
        business_id = data.get('business_id')
        rating = int(data.get('rating'))
        comment = data.get('comment')

        try:
            business = get_object_or_404(Business, id=business_id)
            review = Review(user_id=user_id, business=business, rating=rating, comment=comment)
            review.save()
            cache.delete(f'business_reviews_{business_id}')  # Clear cache after adding review
            return JsonResponse({'message': 'Review added successfully'}, status=201)
        except Business.DoesNotExist:
            return JsonResponse({'error': 'Business not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def redeem_incentives(request):
    if request.method == 'POST':
        data = request.POST
        farmer_id = data.get('farmer_id')

        try:
            farmer = get_object_or_404(Farmer, id=farmer_id)
            incentive = Incentive.objects.filter(farmer=farmer, redeemed=False).first()

            if incentive:
                incentive.redeemed = True
                incentive.save()
                return JsonResponse({'message': 'Incentives redeemed successfully'}, status=200)
            return JsonResponse({'error': 'No incentives available for redemption'}, status=404)
        except Farmer.DoesNotExist:
            return JsonResponse({'error': 'Farmer not found'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def log_activity(request):
    if request.method == 'POST':
        data = request.POST
        farmer_id = data.get('farmer_id')
        practice = data.get('practice')
        category = data.get('category')
        details = data.get('details', '')
        input_quantity = data.get('input_quantity', '')
        output_quantity = data.get('output_quantity', '')
        location = data.get('location', '')

        weather_cache_key = f'weather_{location}'
        weather_conditions = cache.get(weather_cache_key)

        if not weather_conditions:
            weather_conditions = get_weather(location)
            cache.set(weather_cache_key, weather_conditions, timeout=60 * 30)  # Cache for 30 minutes

        try:
            farmer = get_object_or_404(Farmer, id=farmer_id)
            activity = FarmingActivity(
                farmer=farmer,
                practice=practice,
                category=category,
                details=details,
                input_quantity=input_quantity,
                output_quantity=output_quantity,
                weather_conditions=weather_conditions,
                image=request.FILES.get('image'),
                video=request.FILES.get('video')
            )
            activity.save()
            return JsonResponse({'message': 'Activity logged', 'block_hash': activity.block_hash}, status=201)
        except Farmer.DoesNotExist:
            return JsonResponse({'error': 'Farmer not found'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_activities(request):
    query = request.GET.get('q', '').strip()
    cache_key = f'activities_search_{query}'
    activities = cache.get(cache_key)

    if not activities:
        activities = FarmingActivity.objects.all()
        if query:
            activities = activities.filter(Q(practice__icontains=query) | Q(category__icontains=query))

        cache.set(cache_key, activities, timeout=60 * 15)  # Cache for 15 minutes

    results = [
        {
            "farmer": activity.farmer.name,
            "practice": activity.practice,
            "category": activity.category,
            "details": activity.details,
            "input_quantity": activity.input_quantity,
            "output_quantity": activity.output_quantity,
            "weather_conditions": activity.weather_conditions,
            "image_url": activity.image.url if activity.image else None,
            "video_url": activity.video.url if activity.video else None,
            "date": activity.date,
            "block_hash": activity.block_hash
        } for activity in activities
    ]
    return JsonResponse(results, safe=False)


def get_collaboration_farmers(collaboration_id):
    cache_key = f'collaboration_farmers_{collaboration_id}'
    farmers = cache.get(cache_key)

    if not farmers:
        collaboration = get_object_or_404(Collaboration.objects.prefetch_related('collaborationfarmer_set__farmer'),
                                          id=collaboration_id)
        farmers = list(collaboration.collaborationfarmer_set.all())
        cache.set(cache_key, farmers, timeout=60 * 60)  # Cache for 1 hour

    return farmers


def collaboration_farmers_view(request, collaboration_id):
    query = request.GET.get('q', '').strip()

    farmers = get_collaboration_farmers(collaboration_id)
    if query:
        farmers = [farmer for farmer in farmers if query.lower() in farmer.farmer.name.lower()]  # Simple search by
        # farmer's name

    paginator = Paginator(farmers, 10)  # Show 10 farmers per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'collaboration_farmers.html', {'page_obj': page_obj, 'query': query})


class BusinessListView(generics.ListAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = BusinessFilter
    ordering_fields = ['name', 'rating', 'location']

    def get_queryset(self):
        filters = self.request.GET
        cache_key = f'business_list_{filters}'
        businesses = cache.get(cache_key)

        if not businesses:
            businesses = super().get_queryset()
            cache.set(cache_key, businesses, timeout=60 * 15)  # Cache for 15 minutes

        return businesses
