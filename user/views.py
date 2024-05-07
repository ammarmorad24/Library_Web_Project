from django.contrib.auth import login , logout
from django.shortcuts import redirect, render
from .forms import RegisterForm , LoginForm
from django.contrib.auth.models import User 

# Create your views here.
def register(request):
    # use django forms as I created a RegisterForm class in forms.py
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        
        
        if form.is_valid():
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password1']
            is_superuser = form.cleaned_data['is_superuser']
            if is_superuser:
                user = User.objects.create_superuser(username=username, email=email, password=password)
            else:
                user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
            login(request, user)
            return redirect('home')
        
    else: form = RegisterForm()
    context = {'form': form}
    return render(request, 'register.html', context)


def signIn(request): 
    if request.method == "POST": 
        form = LoginForm(data=request.POST)
        if form.is_valid(): 
            login(request, form.get_user())
            
            return redirect("home")
    else: 
        form = LoginForm()
    
    return render(request, "sign-in.html", { "form": form })


def signOut(request):
    # Logout user and redirect to home page
    logout(request)
    return redirect("/")
