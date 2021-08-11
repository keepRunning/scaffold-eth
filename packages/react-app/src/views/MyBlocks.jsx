import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";
import AnsiImageRender from "./AnsiImageRender"

//import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';

import { NFTStorage, File } from 'nft.storage';

const nftStorageApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQzYjgwMzQ4MzY1MWE4MDE5MjU5NzQ2MjY5ZjM1ZDI4NUMzMEJlQjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyODE1NzYxNTc3NCwibmFtZSI6ImtleTEifQ.G9BNydhDBxYJqYr06xSW-hRbkj5AptqaijFokHPx3h0';
const nftsClient = new NFTStorage({ token: nftStorageApiKey })

async function nftsTestStoreString(s) {
  const metadata = await nftsClient.store({
    name: 'nft.storage store test',
    description: 'Description: ' + s,
    image: new File(['<DATA>'], 'notansi.jpg', { type: 'image/jpg' }),
    //image: new Blob('XXX'),
    properties: {
      custom: 'Custom data can appear here, files are auto uploaded.',
      //file: new File(['<DATA>'], 'README.md', { type: 'text/plain' }),
      file: new File([new Blob(['this is a blob', 'by tomo'])], 'README.md', { type: 'text/plain' }),
    }
  })

  console.log('IPFS URL for the metadata:', metadata.url)
  console.log('metadata.json contents:\n', metadata.data)
  console.log('metadata.json with IPFS gateway URLs:\n', metadata.embed())
}


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useModalStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function MakeBlockModal() {

  const classes = useModalStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Mint New Block!</h2>
      <p id="simple-modal-description">

        You will get the next available block. 
      </p><p>
        Current expected position:

      </p><p>
        Col: 0,
      </p><p>
        Row: 0
      </p>
      <button>MINT NEXT AVAILABLE BLOCK</button>
      <p>
        Current contents:
        
        <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', width: 270 }} tokenURI={"tna1.ans"} />
      </p><p>
        Choose .ans file to save into your chosen block:
        <input type="file" id="input" onChange={(evt) => console.log("event: ", evt, "selected file: ", evt.target.files[0])} />
      </p><p>
        A preview of your ANSi will appear here
      </p><p>
        TODO: <button>TEST FILE UPLOAD</button>
      </p>
    </div>
  );

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        Manage Blocks / Mint &amp; Write / CLICK ME TO OPEN DIALOG
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

// copied from ansi
const useStyles = makeStyles((theme) => ({
    root: {
          flexGrow: 1,
        },
    paper: {
          padding: theme.spacing(2),
          textAlign: 'center',
          color: theme.palette.text.secondary,
          margin: 20,
          border: '2px solid black',
          boxShadow: '2px 2px 4px 0',
        },
}));

function RecentlySavedBlocks({limit}) {
  const [newFilterAddress, setNewFilterAddress] = useState();
  const classes = useStyles();
  let ansiFileNames = [
    'tna1.ans',
    'tna2.ans',
    'tna3.ans',
    'tna4.ans',
    'tna4.ans',
    'tna4.ans',
    /*
    'Shion%20in%20Monster%20World.ans',
    'TestPattern%20ANSI.ans',
    'Tetris.ans',
    */
  ];
  //let ansiUriArr = ansiFileNames.map(a => ({name: a, path: 'https://raw.githubusercontent.com/PhMajerus/ANSI-art/master/' + a}));
  let ansiUriArr = ansiFileNames.map(a => ({name: a, path: '/' + a}));
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <div style={{border: '1px solid black'}}>
          <h2 style={{fontFamily: '"Roboto", sans-serif', fontSize: '4em', textAlign: 'left', fontWeight: 800}} className='foobar'>Recently Saved Blocks ({limit})</h2>
          <Input
            onChange={e => {
              setNewFilterAddress(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => { console.log('TODO filter by address') }}
          >Filter Blocks by Address
          </Button>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => { console.log('TODO filter by address') }}
          >Filter Blocks by My Address
          </Button>
          <div className="ansi-grid-wrapper">
          <Grid container spacing={3,0} >

            {'tna1.ans|tna2.ans|tnb1.ans|tnb2.ans'.split('|').map((uri, i) => (
                    <div key={"ansi1-" + i} className="ansi-wrapper" style={{maxWidth: 400}}>
                      <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', width: 270 }} tokenURI={uri} />
                    </div>
            ))}
          </Grid><Grid container spacing={3,0} >
            {'tna3.ans|tna4.ans|tnb3.ans|tnb4.ans'.split('|').map((uri, i) => (
                    <div key={"ansi1-" + i} className="ansi-wrapper" style={{maxWidth: 400}}>
                      <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', width: 270 }} tokenURI={uri} />
                    </div>
            ))}
          </Grid><Grid container spacing={3,0} >
            {'tna1.ans|tna2.ans|tnb1.ans|tnb2.ans'.split('|').map((uri, i) => (
                    <div key={"ansi1-" + i} className="ansi-wrapper" style={{maxWidth: 400}}>
                      <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', width: 270 }} tokenURI={uri} />
                    </div>
            ))}
          </Grid><Grid container spacing={3,0} >
            {'tna1.ans|tna2.ans|tnb1.ans|tnb2.ans'.split('|').map((uri, i) => (
                    <div key={"ansi1-" + i} className="ansi-wrapper" style={{maxWidth: 400}}>
                      <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', width: 270 }} tokenURI={uri} />
                    </div>
            ))}
          </Grid>
          </div>
          <Grid container spacing={3,0} >
            {ansiUriArr.map((uri, i) => (
                <Grid key={"ansi2-" + i} item xs >
                  <Paper className={classes.paper}>
                    <div className="ansi-wrapper" style={{maxWidth: 400}}>
                      <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', height: 240, width: 284 }} tokenURI={uri.path} />
                    </div>
                    <h3>FILE: {uri.name}</h3>
                    <ul><li>Row: 66</li><li>Col: 6</li><li>Owner: 0x92928...13812313</li></ul>
                  </Paper>
                </Grid>
            ))}

          </Grid>
        </div>
      </Grid>
    </div>
  )
}


export default function MyBlocks({
  myBBlocksCount,
  my1stBBlockTokenId,
  my1stBBlockTokenURI,
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");
  const [newTokenURI, setNewTokenURI] = useState("loading...");

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, /*width: 400,*/ margin: "auto", marginTop: 64 }}>
        <h2>Bulletin Block System Permissionless Distributed UI:</h2>
        {/* <h4>purpose: {purpose}</h4> */}
        <Divider />
        <RecentlySavedBlocks limit={3} />
        <Divider />
      </div>
    </div>
  );
}
