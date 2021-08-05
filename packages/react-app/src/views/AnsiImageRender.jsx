import React, { useState } from "react";
import { default as AnsiUp } from 'ansi_up';

export default function AnsiImageRender({ tokenURI }) {
  const [html, setNewState] = useState('');

  // tokenURI = 'https://raw.githubusercontent.com/PhMajerus/ANSI-art/master/Super%20Mario%20castle%20(wide)%20(256%20colors).ans'

  const fetchHtml = (url) => {
    fetch(url, {
      "method": "GET",
      "headers": {
      }
    })
      .then(response => response.text())
      .then(response => {
        const ansi_up = new AnsiUp();
        let htmlResp = ansi_up.ansi_to_html(response);
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
    <div dangerouslySetInnerHTML={{ __html: html }}>

    </div>
  );
}
