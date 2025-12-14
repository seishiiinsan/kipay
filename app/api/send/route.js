import { Resend } from 'resend';
import { render } from '@react-email/render';
import ContactEmailTemplate from '@/components/ContactEmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    console.log('Sending email with data:', { name, email, message });

    // Rendu manuel du template en HTML
    const emailHtml = await render(ContactEmailTemplate({ name, email, message }));

    const { data, error } = await resend.emails.send({
      from: 'Kipay Contact <onboarding@resend.dev>',
      to: ['gabinhalloss@gmail.com'],
      subject: `Nouveau message de ${name} via Kipay`,
      html: emailHtml, // On envoie du HTML brut au lieu du composant React
    });

    if (error) {
      console.error('Error from Resend:', error);
      return Response.json({ error }, { status: 500 });
    }

    console.log('Email sent successfully:', data);
    return Response.json(data);
  } catch (error) {
    console.error('Caught an exception:', error);
    return Response.json({ error }, { status: 500 });
  }
}
