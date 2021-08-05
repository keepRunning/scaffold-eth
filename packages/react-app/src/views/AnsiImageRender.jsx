import React, { useState } from "react";
import { default as AnsiUp } from 'ansi_up';



export default function AnsiImageRender() {

  const tokenURI = 'https://raw.githubusercontent.com/PhMajerus/ANSI-art/master/Super%20Mario%20castle%20(wide)%20(256%20colors).ans'

  const html = '';
  const fetchHtml = (url) => {
    fetch(url, {
      "method": "GET",
      "headers": {
        // "x-rapidapi-host": "fairestdb.p.rapidapi.com",
        // "x-rapidapi-key": "apikey"
      }
    })
      .then(response => response.text())
      .then(response => {
        debugger;
        console.log(response.length);

        const ansi_up = new AnsiUp();
        html = ansi_up.ansi_to_html(response);
        console.log(html);
      })
      .catch(err => {
        console.log(err);
      });
  }

  fetchHtml(tokenURI);
  // const [newPurpose, setNewPurpose] = useState("loading...");
  // console.log(newPurpose, setNewPurpose);




  // const ansi_up = new AnsiUp();
  // const txt = "\n\n\x1B[1;33;40m 33;40  \x1B[1;33;41m 33;41  \x1B[1;33;42m 33;42  \x1B[1;33;43m 33;43  \x1B[1;33;44m 33;44  \x1B[1;33;45m 33;45  \x1B[1;33;46m 33;46  \x1B[1m\x1B[0\n\n\x1B[1;33;42m >> Tests OK\n\n"
  // let html = ansi_up.ansi_to_html(txt);
  // const [message, setMessage] = useState("");
  return (
    <div dangerouslySetInnerHTML={{ __html: html }}>

    </div>
  );
}
