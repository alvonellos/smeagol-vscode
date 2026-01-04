/**
 * Test file for Smeagol complexity analyzer
 * Open this file in VS Code and save it to see automatic complexity analysis!
 */

// SIMPLE - Complexity 1 (GREEN) ✓
function simple(x) {
  return x * 2;
}

// MODERATE - Complexity 3 (YELLOW) ⚠️
function moderate(user, validate = true) {
  if (validate) {
    if (user.isActive()) {
      return user.getData();
    }
  }
  return null;
}

// COMPLEX - Complexity 5+ (RED) 🔴
function complex(data, validate = false, transform = false, cache = false) {
  if (validate) {
    if (!isValid(data)) {
      return null;
    }
    
    if (transform) {
      data = transformData(data);
    }
    
    if (cache) {
      if (cacheExists(data)) {
        return getCached(data);
      } else {
        const result = process(data);
        cacheResult(result);
        return result;
      }
    }
  }
  
  return data;
}

// HIGHLY COMPLEX - Complexity 15+ (DARK RED) 🔴🔴
function veryComplex(a, b, c, d, e) {
  if (a) {
    if (b) {
      if (c) {
        if (d) {
          if (e) {
            return "all true";
          } else {
            return "e false";
          }
        } else {
          return "d false";
        }
      } else {
        return "c false";
      }
    } else {
      if (c) {
        return "b false, c true";
      } else {
        return "b and c false";
      }
    }
  } else {
    if (b) {
      if (c) {
        return "a false, b and c true";
      } else {
        return "a false, b true, c false";
      }
    } else {
      if (c) {
        return "a and b false, c true";
      } else {
        if (d) {
          return "all false except d";
        } else {
          return "all false";
        }
      }
    }
  }
}

// SWITCH CASE - Multiple branch paths
function statusHandler(statusCode, data = null) {
  if (statusCode === 200) {
    if (data) {
      return processSuccess(data);
    } else {
      return "OK";
    }
  } else if (statusCode === 201) {
    if (data) {
      return processCreated(data);
    } else {
      return "Created";
    }
  } else if (statusCode === 400) {
    if (data) {
      return processError(data);
    } else {
      return "Bad Request";
    }
  } else if (statusCode === 401) {
    return "Unauthorized";
  } else if (statusCode === 403) {
    return "Forbidden";
  } else if (statusCode === 404) {
    return "Not Found";
  } else if (statusCode === 500) {
    return "Server Error";
  } else {
    return "Unknown Status";
  }
}

// TERNARY OPERATORS - Exponential branches
function calculate(a, b, operation) {
  return operation === "add" ? a + b :
         operation === "sub" ? a - b :
         operation === "mul" ? a * b :
         operation === "div" ? a / b :
         operation === "pow" ? a ** b :
         0;
}

// CLASS WITH METHODS
class DataProcessor {
  validate(obj) {
    // Moderate - 4 branches
    if (obj === null) return false;
    if (!obj.valid) return false;
    if (!obj.active) return false;
    return true;
  }

  process(items) {
    // Complex - multiple decision points
    const results = [];
    
    for (const item of items) {
      if (item === null) continue;
      if (!item.enabled) continue;
      
      if (item.priority === "high") {
        results.unshift(item);
      } else if (item.priority === "medium") {
        results.push(item);
      } else if (item.priority === "low") {
        results.push(item);
      }
    }
    
    return results;
  }

  // Nested conditions - COMPLEX
  handleRequest(request) {
    if (request && request.valid) {
      if (request.authenticated) {
        if (request.authorized) {
          if (request.data) {
            if (Array.isArray(request.data)) {
              return this.processArray(request.data);
            } else {
              return this.processObject(request.data);
            }
          }
        } else {
          return { error: "Not authorized" };
        }
      } else {
        return { error: "Not authenticated" };
      }
    } else {
      return { error: "Invalid request" };
    }
  }
}

// ASYNC FUNCTIONS
async function fetchAndProcess(url, options = {}) {
  try {
    if (!url) {
      throw new Error("URL required");
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Not found");
      } else if (response.status === 401) {
        throw new Error("Unauthorized");
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    }
    
    const data = await response.json();
    
    if (options.transform) {
      if (Array.isArray(data)) {
        return data.map(item => options.transform(item));
      } else if (typeof data === 'object') {
        return options.transform(data);
      }
    }
    
    return data;
  } catch (error) {
    if (options.errorHandler) {
      return options.errorHandler(error);
    } else {
      throw error;
    }
  }
}

console.log("Save this file to trigger Smeagol complexity analysis!");
console.log("Open the Problems panel (Ctrl+Shift+M) to see results");
console.log("");
console.log("🟢 GREEN = Complexity 1-5 (Good)");
console.log("🟡 YELLOW = Complexity 6-10 (Fair)");
console.log("🔴 RED = Complexity 11-20 (High - Consider Refactoring)");
console.log("🔴🔴 DARK RED = Complexity 20+ (Critical - Refactor Now!)");
