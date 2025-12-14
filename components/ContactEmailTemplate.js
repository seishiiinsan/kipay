import * as React from 'react';

export default function ContactEmailTemplate({ name, email, message }) {
  return (
    <div>
      <h1>Nouveau message depuis le formulaire de contact Kipay</h1>
      <p>
        Vous avez reçu un nouveau message de la part de <strong>{name}</strong> ({email}).
      </p>
      <h2>Message :</h2>
      <p>{message}</p>
    </div>
  );
}
