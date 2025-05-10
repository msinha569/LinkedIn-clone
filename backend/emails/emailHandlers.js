// emailHandler.js
import { resend, sender } from "../lib/resend.js"
import {
  createCommentNotificationEmailTemplate,
  createConnectionAcceptedEmailTemplate,
  createWelcomeEmailTemplate
} from "./emailTemplates.js"

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  try {
    const response = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to LinkedIn",
      html: createWelcomeEmailTemplate(name, profileUrl),
    })
    console.log("email sent successfully:", response)
  } catch (error) {
    console.error("error in sendWelcomeEmail:", error)
    throw error
  }
}
export const sendCommentNotificationEmail = async (
    recipientEmail,
    recipientName,
    commenterName,
    commentContent,
    postUrl
  ) => {
    try {
      const response = await resend.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: recipientEmail, 
        subject: "New Comment on your post",
        html: createCommentNotificationEmailTemplate(
          recipientName,
          commenterName, 
          postUrl,
          commentContent
        )
      });
      console.log("comment notification email sent successfully:", response);
    } catch (error) {
      console.error("error in sendCommentNotificationEmail:", error);
    }
  };
  

export const sendConnectionAcceptedEmail = async (
  senderEmail,
  senderName,
  recipientName,
  profileUrl
) => {
  try {
    const response = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: senderEmail,
      subject: `${senderName} accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(
        senderName,
        recipientName,
        profileUrl
      )
    })
    console.log("connection accepted email sent successfully:", response)
  } catch (error) {
    console.error("error in sendConnectionAcceptedEmail:", error)
  }
}
