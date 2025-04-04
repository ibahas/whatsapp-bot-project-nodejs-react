// في routes/campaigns.js عند اكتمال الإرسال
const newNotification = new Notification({
    user: campaign.user,
    title: 'اكتملت الحملة',
    message: `الحملة "${campaign.name}" تم إرسالها بنجاح`,
    type: 'success',
    link: `/campaigns/${campaign._id}`
});
await newNotification.save();
sendNotification(campaign.user, newNotification);