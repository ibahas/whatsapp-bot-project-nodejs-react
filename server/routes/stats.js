router.get('/trigger-messages/:campaignId', async (req, res) => {
    const campaign = await Campaign.findById(req.params.campaignId)
        .populate('messages');

    const stats = {
        views: campaign.messages.filter(msg => msg.status === 'viewed').length,
        interactions: campaign.messages.filter(msg => msg.buttonsClicked.length > 0).length,
        unsubscribes: campaign.unsubscribes
    };

    res.json(stats);
});