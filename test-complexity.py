#!/usr/bin/env python3
"""
Test file for Smeagol complexity analyzer
Open this file in VS Code and save it to see automatic complexity analysis!
"""

def simple_function(x):
    """Simple function - should be green (complexity 1)"""
    return x * 2

def moderate_function(user, validate=True):
    """Moderate complexity - should be yellow (complexity 3-4)"""
    if validate:
        if user.is_active():
            return user.get_data()
    return None

def complex_function(data, validate=False, transform=False, cache=False):
    """
    Complex function - should be RED (complexity 7+)
    This is a good candidate for refactoring!
    """
    if validate:
        if not is_valid(data):
            return None
        
        if transform:
            data = transform_data(data)
        
        if cache:
            if cache_exists(data):
                return get_cached(data)
            else:
                result = process(data)
                cache_result(result)
                return result
    
    return data

def highly_complex_function(a, b, c, d, e):
    """
    VERY COMPLEX - should be DARK RED (complexity 15+)
    This NEEDS refactoring immediately!
    """
    if a:
        if b:
            if c:
                if d:
                    if e:
                        return "all true"
                    else:
                        return "e false"
                else:
                    return "d false"
            else:
                return "c false"
        else:
            if c:
                return "b false, c true"
            else:
                return "b and c false"
    else:
        if b:
            if c:
                return "a false, b and c true"
            else:
                return "a false, b true, c false"
        else:
            if c:
                return "a and b false, c true"
            else:
                if d:
                    return "all false except d"
                else:
                    return "all false"

class DataProcessor:
    """Test class with multiple methods"""
    
    def validate(self, obj):
        """Moderate complexity"""
        if obj is None:
            return False
        if not obj.valid:
            return False
        if not obj.active:
            return False
        return True
    
    def process(self, items):
        """High complexity - multiple branches"""
        results = []
        for item in items:
            if item is None:
                continue
            if not item.enabled:
                continue
            if item.priority == "high":
                results.insert(0, item)
            elif item.priority == "medium":
                results.append(item)
            else:
                pass
        return results

# Test with switch-like structure (using match in Python 3.10+)
def status_handler(status_code, data=None):
    """
    Simulates switch/case complexity
    Branch paths grow with each case
    """
    if status_code == 200:
        if data:
            return process_success(data)
        else:
            return "OK"
    elif status_code == 201:
        if data:
            return process_created(data)
        else:
            return "Created"
    elif status_code == 400:
        if data:
            return process_error(data)
        else:
            return "Bad Request"
    elif status_code == 401:
        return "Unauthorized"
    elif status_code == 403:
        return "Forbidden"
    elif status_code == 404:
        return "Not Found"
    elif status_code == 500:
        return "Server Error"
    else:
        return "Unknown Status"

# Ternary operator branches
def calculate(a, b, operation):
    """Ternary operators create exponential branch paths"""
    return (a + b) if operation == "add" else \
           (a - b) if operation == "sub" else \
           (a * b) if operation == "mul" else \
           (a / b) if operation == "div" else \
           (a ** b) if operation == "pow" else \
           0

if __name__ == "__main__":
    print("Save this file to trigger Smeagol complexity analysis!")
    print("Open the Problems panel (Ctrl+Shift+M) to see results")
    
    # Test data
    test_data = {"valid": True, "active": True}
    print(simple_function(5))
    print(moderate_function(test_data))
    print(complex_function(test_data))
