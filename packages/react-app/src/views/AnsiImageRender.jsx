import React, { useState } from "react";
import { default as AnsiUp } from 'ansi_up';
import './AnsiImageRender.css';

export default function AnsiImageRender({ tokenURI }) {
  const [html, setNewState] = useState('');

  // tokenURI = 'https://raw.githubusercontent.com/PhMajerus/ANSI-art/master/Super%20Mario%20castle%20(wide)%20(256%20colors).ans'

  const fetchHtml = (url) => {
    fetch(url, {
      "method": "GET",
      "headers": {
      }
    })
      .then(response => response.arrayBuffer())
      .then(response => {

        let decoder = new TextDecoder('ISO-8859-1');
        let text = decoder.decode(response);

        const ansi_up = new AnsiUp();
        let htmlResp = ansi_up.ansi_to_html(text);
        setNewState(htmlResp);
      })
      .catch(err => {
        console.log(err);
      });
  }

  if (!html) {
    fetchHtml(tokenURI);
  }

  return (
    <pre dangerouslySetInnerHTML={{ __html: html }} className="ansi-img">

    </pre>
  );
}
