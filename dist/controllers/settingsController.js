export async function getSettings(_req, res) {
    return res.json({
        settings: {
            brandName: "DigitalPylot",
            supportEmail: "support@digitalpylot.local",
        },
    });
}
