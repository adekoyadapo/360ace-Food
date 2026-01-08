type ContactRequestEmailProps = {
  name: string;
  email: string;
  organization?: string;
  serviceNeed?: string;
  message: string;
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default function ContactRequestEmail({ name, email, organization, serviceNeed, message }: ContactRequestEmailProps) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeOrg = organization ? escapeHtml(organization) : '';
  const safeNeed = serviceNeed ? escapeHtml(serviceNeed) : '';
  const safeMessage = escapeHtml(message);
  return `
    <html>
      <body style="font-family: Inter, system-ui, sans-serif; padding: 24px; background-color: #f5f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 24px;">
          <tbody>
            <tr>
              <td>
                <h1 style="font-size: 20px; margin-bottom: 16px; color: #0b1a2a;">New 360ace.Food inquiry</h1>
                <p style="margin: 4px 0; color: #0b1a2a;"><strong>Name:</strong> ${safeName}</p>
                <p style="margin: 4px 0; color: #0b1a2a;"><strong>Email:</strong> ${safeEmail}</p>
                ${safeOrg ? `<p style="margin: 4px 0; color: #0b1a2a;"><strong>Organization:</strong> ${safeOrg}</p>` : ''}
                ${safeNeed ? `<p style="margin: 4px 0; color: #0b1a2a;"><strong>Focus area:</strong> ${safeNeed}</p>` : ''}
                <div style="margin-top: 20px;">
                  <p style="font-weight: 600; font-size: 14px; text-transform: uppercase; color: #0b1a2a; letter-spacing: 0.12em;">Message</p>
                  <p style="margin-top: 12px; color: #0b1a2a; line-height: 1.6;">${safeMessage}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  `;
}
