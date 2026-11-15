/* ============================================================
   contact.js – contact form validation
   The form has novalidate, so all checking happens here.
   Each invalid field gets a red border and a message below it;
   the message clears as soon as the user fixes the field.
   ============================================================ */

var contactForm = document.getElementById('contactForm');
var successMsg = document.getElementById('successMsg');

// The four fields, each paired with its error message element
var fields = {
  name:    { input: document.getElementById('name'),    error: document.getElementById('nameError') },
  email:   { input: document.getElementById('email'),   error: document.getElementById('emailError') },
  phone:   { input: document.getElementById('phone'),   error: document.getElementById('phoneError') },
  message: { input: document.getElementById('message'), error: document.getElementById('messageError') }
};

/* Simple email pattern: something@something.something */
var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Digits only, with an optional + at the start. Spaces are allowed. */
var phonePattern = /^\+?[0-9\s]+$/;

/* ---------- Helpers to show / clear errors ---------- */

function showError(field, message) {
  field.input.classList.add('invalid');     // red border
  field.error.textContent = message;        // red text under the field
  field.error.classList.add('show');
}

function clearError(field) {
  field.input.classList.remove('invalid');
  field.error.classList.remove('show');
}

/* ---------- Check one field, return true if it is valid ---------- */

function validateField(key) {
  var field = fields[key];
  var value = field.input.value.trim();

  // Rule 1: no field may be empty
  if (value === '') {
    showError(field, 'This field is required');
    return false;
  }

  // Rule 2: the email must look like a real address
  if (key === 'email' && !emailPattern.test(value)) {
    showError(field, 'Please enter a valid email address');
    return false;
  }

  // Rule 3: the phone number may only contain digits (and a leading +)
  if (key === 'phone' && !phonePattern.test(value)) {
    showError(field, 'Phone number should contain digits only');
    return false;
  }

  clearError(field);
  return true;
}

/* ---------- Submit: check everything ---------- */

contactForm.addEventListener('submit', function (event) {
  event.preventDefault(); // no real sending needed for this project

  var allValid = true;

  // Validate every field; remember if any failed
  Object.keys(fields).forEach(function (key) {
    if (!validateField(key)) {
      allValid = false;
    }
  });

  if (allValid) {
    // Personal thank-you message, then reset the form
    var name = fields.name.input.value.trim();
    successMsg.textContent = 'Thanks, ' + name + '! Your message has been sent.';
    successMsg.classList.add('show');
    contactForm.reset();
  } else {
    successMsg.classList.remove('show');
  }
});

/* ---------- Clear errors live while the user types ---------- */

Object.keys(fields).forEach(function (key) {
  fields[key].input.addEventListener('input', function () {
    // Re-check only once the field already shows an error,
    // so the message disappears the moment it is fixed
    if (fields[key].input.classList.contains('invalid')) {
      validateField(key);
    }
  });
});
