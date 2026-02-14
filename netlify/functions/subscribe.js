// Use dynamic import for node-fetch or fallback to global fetch
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)).catch(() => global.fetch(...args));

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { email, name } = JSON.parse(event.body);

        if (!email) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) };
        }

        const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
        const BEEHIIV_PUB_ID = process.env.BEEHIIV_PUBLICATION_ID;
        const BEEHIIV_URL = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`;

        console.log(`Subscribing ${email} to Beehiiv Pub ID: ${BEEHIIV_PUB_ID}`);


        const toTitleCase = (str) => {
            return str.replace(
                /\w\S*/g,
                (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        };

        const formattedName = name ? toTitleCase(name) : '';

        const response = await fetch(BEEHIIV_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                reactivate_existing: false,
                send_welcome_email: true,
                utm_source: 'AI Empire Website',
                utm_medium: 'organic',
                utm_campaign: 'beginner_kit',
                tier: 'free',
                tags: ['beginner_kit_lead'],
                custom_fields: [
                    {
                        name: 'Name',
                        value: formattedName
                    }
                ]
            })
        });

        console.log(`Beehiiv API Status: ${response.status} ${response.statusText}`);
        const data = await response.json();
        console.log('Beehiiv API Response Body:', JSON.stringify(data, null, 2));

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, data })
            };
        } else {
            console.error('Beehiiv API Error:', data);
            return {
                statusCode: response.status,
                body: JSON.stringify({ success: false, error: data })
            };
        }

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: 'Internal Server Error' })
        };
    }
};
