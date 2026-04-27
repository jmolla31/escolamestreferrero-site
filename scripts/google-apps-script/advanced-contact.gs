function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Wait for up to 30 seconds for other processes to finish
    lock.waitLock(30000);

    const params = e.parameter;
    
    // 1. Honeypot Validation (The "_gotcha" field from your Astro form)
    // If this is filled, it's almost certainly a bot.
    if (params._gotcha) {
      return createResponse("Spam detected", 400);
    }

    // 2. Basic Field Validation
    const name = params.name ? params.name.trim() : "";
    const email = params.email ? params.email.trim() : "";
    const message = params.message ? params.message.trim() : "";

    if (!name || !email || !message) {
      return createResponse("All required fields must be filled", 400);
    }

    if (!validateEmail(email)) {
      return createResponse("Invalid email format", 400);
    }

    // 3. Rate Limiting (Cooldown per email)
    const props = PropertiesService.getScriptProperties();
    const lastSent = props.getProperty(`last_sent_${email}`);
    const now = new Date().getTime();
    const COOLDOWN_PERIOD = 60 * 1000; // 1 minute in milliseconds

    if (lastSent && (now - lastSent < COOLDOWN_PERIOD)) {
      return createResponse("Too many requests. Please wait a minute.", 429);
    }

    // --- Actual Email Sending ---
    const section = params.section || 'unknown';
    const recipient = "your-email@yourdomain.com";
    const subject = `[${section}] Contact Form Submission from ${name}`;
    const body = `Section: ${section}\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
    
    MailApp.sendEmail(recipient, subject, body);

    // Update the timestamp for this email address
    props.setProperty(`last_sent_${email}`, now.toString());

    return createResponse("Success", 200);

  } catch (error) {
    return createResponse(`Server Error: ${error.toString()}`, 500);
  } finally {
    lock.releaseLock();
  }
}

// Helper to validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Helper to create JSON responses
function createResponse(message, statusCode) {
  const output = JSON.stringify({ 
    result: statusCode === 200 ? "success" : "error", 
    message: message 
  });
  
  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}
