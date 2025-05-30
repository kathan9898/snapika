import emailjs from 'emailjs-com';

export async function sendUploadMail(to_email) {
  return emailjs.send(
    "YOUR_SERVICE_ID",
    "YOUR_TEMPLATE_ID",
    {
      to_email,
      passcode: "Your photos are saved."
    },
    "YOUR_USER_ID"
  );
}
