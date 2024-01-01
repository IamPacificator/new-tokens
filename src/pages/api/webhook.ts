export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      const webhook: any = process.env.DISCORD_WEBHOOK;
      const webhookData = req.body[0]; // Assuming the payload is an array with a single object

      const tokenMintDetails = webhookData.tokenTransfers[0]; // Assuming there's only one token transfer

      // Assuming you have a function to get asset details based on the minted token
      const tokenDetails = await getAsset(tokenMintDetails.token);

      const embed = {
        title: `${tokenDetails.content.metadata.name} has been minted!`,
        url: `https://solscan.io/token/${tokenMintDetails.token}`,
        color: 16486972,
        fields: [
          { name: '\u200B', value: '\u200B' },
          {
            name: ':gem: Minted Amount',
            value: `**${webhookData.accountData.length} Tokens**`,
            inline: true,
          },
          {
            name: ':date: Mint Date',
            value: `<t:${webhookData.timestamp}:R>`,
            inline: true,
          },
          { name: '\u200B', value: '\u200B' },
          {
            name: 'Minting Account',
            value: `${webhookData.feePayer.slice(0, 4)}..${webhookData.feePayer.slice(-4)}`,
            inline: true,
          },
        ],
        image: {
          url: tokenDetails.content.files[0].uri,
        },
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Helius',
          icon_url:
            'https://assets-global.website-files.com/641a8c4cac3aee8bd266fd58/642b5b2804ea37191a59737b_favicon-32x32.png',
        },
      };

      const response = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: null,
          embeds: [embed],
        }),
      });

      console.log(response);
      res.status(200).json('success');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('error');
  }
}
