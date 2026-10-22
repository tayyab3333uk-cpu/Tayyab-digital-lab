<?php
/**
 * TAYYAB FAISAL — FULL-STACK DEVELOPER PORTFOLIO
 * Backend API Contact Form Handler (api/contact.php)
 *
 * Requirements: PHP 7.4+ or PHP 8.x
 * Local Testing: Works out of the box in XAMPP (htdocs) or PHP built-in server.
 */

// Set JSON headers
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Only POST requests are accepted.'
    ]);
    exit;
}

// Retrieve raw JSON body
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

// Fallback to standard $_POST if not JSON
if (!$data && !empty($_POST)) {
    $data = $_POST;
}

if (!$data) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request payload. Expected JSON or form data.'
    ]);
    exit;
}

// Sanitize inputs
$name    = isset($data['name']) ? trim(filter_var($data['name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';
$email   = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';
$subject = isset($data['subject']) ? trim(filter_var($data['subject'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';
$message = isset($data['message']) ? trim(filter_var($data['message'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

if (empty($subject)) {
    $errors[] = 'Subject is required.';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors),
        'errors'  => $errors
    ]);
    exit;
}

// Target recipient
$recipient = 'tayyab3333.uk@gmail.com';
$emailSubject = "[Portfolio Inquiry] " . $subject;

$emailBody = "New message received from Tayyab Faisal's Developer Portfolio:\n\n";
$emailBody .= "Sender Name: " . $name . "\n";
$emailBody .= "Sender Email: " . $email . "\n";
$emailBody .= "Subject: " . $subject . "\n";
$emailBody .= "Timestamp: " . date('Y-m-d H:i:s T') . "\n\n";
$emailBody .= "Message:\n" . $message . "\n";

$headers = [
    'From' => 'no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost'),
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion()
];

// Attempt mail sending if sendmail/SMTP configured
$mailSent = false;
if (function_exists('mail') && ini_get('sendmail_path')) {
    $headerString = '';
    foreach ($headers as $key => $val) {
        $headerString .= "$key: $val\r\n";
    }
    $mailSent = @mail($recipient, $emailSubject, $emailBody, $headerString);
}

// Log inquiry to local audit file for verification when running in development
$logDir = __DIR__ . '/../logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}

$logEntry = sprintf(
    "[%s] IP: %s | From: %s <%s> | Subject: %s\nMessage: %s\n---\n",
    date('c'),
    $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN',
    $name,
    $email,
    $subject,
    $message
);
@file_put_contents($logDir . '/contact_submissions.log', $logEntry, FILE_APPEND);

// Respond to client
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Thank you for reaching out! Your message was received and logged successfully.',
    'mail_dispatched' => $mailSent
]);
exit;
