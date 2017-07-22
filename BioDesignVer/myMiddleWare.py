from django.utils.deprecation import MiddlewareMixin
class PrintTest(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response
        print("create myMiddleWare")
    def __call__(self, request):
        print("!!!!!!!!!!before")
        response = self.get_response(request)
        print("!!!!!!!!!!after")
        return response