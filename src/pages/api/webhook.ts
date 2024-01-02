const rpc = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_KEY}`

const getAsset = async (token: string) => {
  const response = await fetch(rpc, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAsset',
      params: {
        id: token
      },
    }),
  });
  const { result } = await response.json();
  return result;
};

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {
      const webhook: any = process.env.DISCORD_WEBHOOK;
      let webhook_data = req.body;

      console.log(webhook_data, 'e1');

      // Convert webhook_data to a string
      const webhookDataString = JSON.stringify(webhook_data);

      // Split the string into chunks of 2000 characters (Discord's character limit)
      const chunks = webhookDataString.match(/[\s\S]{1,2000}/g) || [];

      // Send each chunk as a separate message
      for (const chunk of chunks) {
        const response = await fetch(webhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: chunk,
          }),
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}
