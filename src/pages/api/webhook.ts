import fetch from 'node-fetch';

const rpc = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_KEY}`;

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
        id: token,
      },
    }),
  });
  const { result } = await response.json();
  return result;
};

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      const webhook: any = process.env.DISCORD_WEBHOOK;

      let webhookData = req.body;

      console.log(webhookData, 'e1');
      console.log(webhookData[0].events.tokenTransfers[0]);
      let token: any = await getAsset(webhookData[0].events.tokenTransfers[0].token);

      const response = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: null,
          embeds: [
            {
              title: `Token Minted: ${token.content.metadata.name}`,
              url: `https://solscan.io/token/${webhookData[0].events.tokenTransfers[0].token}`,
              color: 16486972,
              fields: [
                {
                  name: '\u200B',
                  value: '\u200B',
                },
                {
                  name: ':gem: Minted Amount',
                  value: `**${webhookData[0].accountData.length} Tokens**`,
                  inline: true,
                },
                {
                  name: ':date: Mint Date',
                  value: `<t:${webhookData[0].timestamp}:R>`,
                  inline: true,
                },
                {
                  name: '\u200B',
                  value: '\u200B',
                },
                {
                  name: 'Minting Account',
                  value: webhookData[0].feePayer.slice(0, 4) + '..' + webhookData[0].feePayer.slice(-4),
                  inline: true,
                },
              ],
              image: {
                url: token.content.files[0].uri,
              },
              timestamp: new Date().toISOString(),
              footer: {
                text: 'Helius',
                icon_url: 'https://assets-global.website-files.com/641a8c4cac3aee8bd266fd58/642b5b2804ea37191a59737b_favicon-32x32.png',
              },
            },
          ],
        }),
      });
      console.log(response);
      res.status(200).json('success');
    }
  } catch (err) {
    console.log(err);
  }
}
