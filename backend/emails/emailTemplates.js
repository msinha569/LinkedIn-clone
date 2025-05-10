export function createWelcomeEmailTemplate(name, profileUrl) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to UnLinked</title>
  <style>
    @media (max-width: 600px) {
      .container {
        padding: 15px !important;
      }
      .btn {
        width: 100% !important;
        display: block !important;
      }
      h1 {
        font-size: 24px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333;">
  <div style="max-width: 600px; margin: auto; background: #f9f9f9;">
    <div style="background: linear-gradient(to right, #0077B5, #00A0DC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="UnLinked Logo" style="width: 100px; max-width: 150px; border-radius: 10px;"/>
      <h1 style="color: white; margin: 20px 0 0;">Welcome to UnLinked!</h1>
    </div>
    <div class="container" style="background-color: #ffffff; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${name},</strong></p>
      <p>We're thrilled to have you join our professional community! UnLinked is your platform to connect, learn, and grow in your career.</p>
      <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Here's how to get started:</strong></p>
        <ul>
          <li>Complete your profile</li>
          <li>Connect with colleagues and friends</li>
          <li>Join groups relevant to your interests</li>
          <li>Explore job opportunities</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${profileUrl}" class="btn" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">Complete Your Profile</a>
      </div>
      <p>If you have any questions or need assistance, our support team is always here to help.</p>
      <p>Best regards,<br>The UnLinked Team</p>
    </div>
  </div>
</body>
</html>
`;
}

export const createConnectionAcceptedEmailTemplate = (senderName, recipientName, profileUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Connection Request Accepted</title>
  <style>
    @media (max-width: 600px) {
      .container {
        padding: 15px !important;
      }
      .btn {
        width: 100% !important;
        display: block !important;
      }
      h1 {
        font-size: 24px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333;">
  <div style="max-width: 600px; margin: auto; background: #f9f9f9;">
    <div style="background: linear-gradient(to right, #0077B5, #00A0DC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="UnLinked Logo" style="width: 100px; max-width: 150px; border-radius: 10px;" />
      <h1 style="color: white; margin: 20px 0 0;">Connection Accepted!</h1>
    </div>
    <div class="container" style="background-color: #ffffff; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${senderName},</strong></p>
      <p><strong>${recipientName}</strong> has accepted your connection request on UnLinked.</p>
      <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>What's next?</strong></p>
        <ul>
          <li>Check out ${recipientName}'s full profile</li>
          <li>Send a message</li>
          <li>Explore mutual connections and interests</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${profileUrl}" class="btn" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">View ${recipientName}'s Profile</a>
      </div>
      <p>Expanding your professional network opens up new opportunities. Keep connecting!</p>
      <p>Best regards,<br>The UnLinked Team</p>
    </div>
  </div>
</body>
</html>
`;

export const createCommentNotificationEmailTemplate = (recipientName, commenterName, postUrl, commentContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Comment on Your Post</title>
  <style>
    @media (max-width: 600px) {
      .container {
        padding: 15px !important;
      }
      .btn {
        width: 100% !important;
        display: block !important;
      }
      h1 {
        font-size: 24px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333;">
  <div style="max-width: 600px; margin: auto; background: #f9f9f9;">
    <div style="background: linear-gradient(to right, #0077B5, #00A0DC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="UnLinked Logo" style="width: 100px; max-width: 150px; border-radius: 10px;" />
      <h1 style="color: white; margin: 20px 0 0;">New Comment on Your Post</h1>
    </div>
    <div class="container" style="background-color: #ffffff; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${recipientName},</strong></p>
      <p><strong>${commenterName}</strong> commented on your post:</p>
      <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-style: italic;">"${commentContent}"</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${postUrl}" class="btn" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">View Comment</a>
      </div>
      <p>Stay engaged with your network by responding to comments and fostering discussions.</p>
      <p>Best regards,<br>The UnLinked Team</p>
    </div>
  </div>
</body>
</html>
`;
