import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, token) {
    const confirmLink = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${token}`;

    try {
        await resend.emails.send({
            from: 'Kipay <onboarding@resend.dev>',
            to: email,
            subject: 'Vérifiez votre adresse email Kipay',
            html: `
        <h1>Bienvenue sur Kipay !</h1>
        <p>Merci de vérifier votre adresse email pour activer votre compte.</p>
        <a href="${confirmLink}" style="display: inline-block; background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; font-weight: bold;">Vérifier mon email</a>
        <p>Ou copiez ce lien : ${confirmLink}</p>
      `,
        });
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

export async function sendNewExpenseEmail(email, expenseDetails) {
    const {description, amount, paidBy, groupName, groupId} = expenseDetails;
    const groupLink = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/groups/${groupId}`;

    try {
        await resend.emails.send({
            from: 'Kipay <onboarding@resend.dev>',
            to: email,
            subject: `Nouvelle dépense dans ${groupName}`,
            html: `
        <div style="font-family: sans-serif; border: 4px solid black; padding: 20px;">
          <h1 style="text-transform: uppercase; margin-top: 0;">Nouvelle Dépense !</h1>
          <p style="font-size: 18px;"><strong>${paidBy}</strong> a ajouté une dépense dans <strong>${groupName}</strong>.</p>
          
          <div style="background-color: #f3f4f6; border: 2px solid black; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 24px; font-weight: bold;">${description}</p>
            <p style="margin: 5px 0 0 0; font-size: 32px; font-weight: 900;">${amount.toFixed(2)} €</p>
          </div>

          <a href="${groupLink}" style="display: block; background-color: #000; color: #fff; padding: 15px; text-decoration: none; font-weight: bold; text-align: center; text-transform: uppercase;">Voir le groupe</a>
        </div>
      `,
        });
        return true;
    } catch (error) {
        console.error('Error sending expense email:', error);
        return false;
    }
}

export async function sendDebtReminderEmail(email, amount, userName) {
    const dashboardLink = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`;

    try {
        await resend.emails.send({
            from: 'Kipay <onboarding@resend.dev>',
            to: email,
            subject: 'Rappel : Vous avez des comptes à régler',
            html: `
        <div style="font-family: sans-serif; border: 4px solid #ef4444; padding: 20px;">
          <h1 style="text-transform: uppercase; margin-top: 0; color: #ef4444;">Rappel Hebdomadaire</h1>
          <p style="font-size: 18px;">Bonjour <strong>${userName}</strong>,</p>
          <p>Ceci est un petit rappel automatique car vous avez activé l'option.</p>
          
          <div style="background-color: #fef2f2; border: 2px solid #ef4444; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px;">Votre dette totale s'élève à :</p>
            <p style="margin: 5px 0 0 0; font-size: 32px; font-weight: 900; color: #ef4444;">${amount.toFixed(2)} €</p>
          </div>

          <p>Pensez à rembourser vos amis pour garder les bons comptes !</p>

          <a href="${dashboardLink}" style="display: block; background-color: #ef4444; color: #fff; padding: 15px; text-decoration: none; font-weight: bold; text-align: center; text-transform: uppercase;">Aller sur mon Dashboard</a>
        </div>
      `,
        });
        return true;
    } catch (error) {
        console.error('Error sending reminder email:', error);
        return false;
    }
}
