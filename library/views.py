from django.shortcuts import render



def landingPage(request):
    return render(request, 'index.html')



def about(request):
    return render(request, 'about.html')




