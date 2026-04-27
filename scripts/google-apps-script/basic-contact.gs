function doPost(e) {
  try {
    const params = e.parameter;
    const name = params.name;
    const email = params.email;
    const message = params.message;
    const section = params.section || 'unknown';
    
    const recipient = "your-email@yourdomain.com"; // Your Gmail address
    const subject = `[${section}] Contact Form Submission from ${name}`;
    const body = `Section: ${section}\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
    
    MailApp.sendEmail(recipient, subject, body);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
