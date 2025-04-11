import { mailtrapClient, sender } from "../lib/mailtrap.js"
import { createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async(email,name,profileUrl) => {
    const recipients = [{email}]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Welcome to LinkedIn",
            html: createWelcomeEmailTemplate(name,profileUrl),
            category: "welcome"
        })   
        console.log("email sent successfully:",response);
        
    } catch (error) {
        throw error
    }
}

export const sendCommentNotificationEmail = async(
    recipientEmail,
    recipientName,
    commentContent,
    postUrl
) => {
    const recipient = [{recipientEmail}]
    try {
        const response =await  mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "New Comment on your post",
            html: createCommentNotificationEmailTemplate(recipientName,recipientEmail,commentContent,postUrl),
            category: "comment_notification"
        })
        console.log("comment notification email sent successfully:",response);
        
    } catch (error) {
        console.log("error in emailHandler:",error);
        
    }
}

export const sendConnectionAcceptedEmail = async(
    senderEmail,
    senderName,
    recipientName,
    profileUrl
) => {
    try {
        const recipient = [{senderEmail}]

        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `${senderName} accepted your connection request`,
            html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
            category: "connection accepted"
        })
        console.log("connectionaccepted email sent successfully: ",response);
        
    } catch (error) {
       console.log("error in email handler:",error);
        
    }
}