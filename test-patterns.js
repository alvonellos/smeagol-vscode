/**
 * Test file for Code Patterns Analyzer and Suggestion Engine
 * Contains intentional patterns to detect
 */

// Pattern 1: Long Parameter List
function processOrder(customerId, orderDate, productId, quantity, price, taxRate, discountPercent, shippingCost, insuranceCost, notificationEmail) {
  console.log(`Processing order for ${customerId}`);
}

// Pattern 2: Deep Nesting
function validateUser(user) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        if (user.role === 'admin') {
          if (user.permissions.includes('write')) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// Pattern 3: Very Long Function (>50 lines)
function calculateOrderTotal(order) {
  console.log("Starting calculation");
  let subtotal = 0;
  for (let i = 0; i < order.items.length; i++) {
    subtotal += order.items[i].price * order.items[i].quantity;
  }
  console.log("Subtotal calculated: " + subtotal);
  
  let discount = 0;
  if (order.customer.loyaltyPoints > 100) {
    discount = subtotal * 0.1;
  } else if (order.customer.loyaltyPoints > 50) {
    discount = subtotal * 0.05;
  }
  console.log("Discount applied: " + discount);
  
  let tax = (subtotal - discount) * 0.08;
  console.log("Tax calculated: " + tax);
  
  let shipping = 0;
  if (subtotal < 50) {
    shipping = 10;
  } else if (subtotal < 100) {
    shipping = 5;
  } else {
    shipping = 0;
  }
  console.log("Shipping set: " + shipping);
  
  let total = subtotal - discount + tax + shipping;
  console.log("Total: " + total);
  
  return total;
}

// Pattern 4: Missing Error Handling
async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  return data;
}

// Pattern 5: Code Duplication
function calculateStateTax(amount) {
  return amount * 0.08;
}

function calculateCountyTax(amount) {
  return amount * 0.08;
}

function calculateLocalTax(amount) {
  return amount * 0.03;
}

// Pattern 6: Magic Numbers
function isValidAge(age) {
  return age >= 18; // What does 18 mean?
}

function canAccessAdultContent(age) {
  if (age < 18) return false; // Magic number again
  return true;
}

// Export for testing
module.exports = {
  processOrder,
  validateUser,
  calculateOrderTotal,
  fetchUserData,
  isValidAge,
  canAccessAdultContent
};
