import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useEventListener,
  useExchangePrice,
  useGasPrice,
  useOnBlock,
  useUserSigner,
} from "../hooks";
import { Address, Balance } from "../components";
import AnsiImageRender from "./AnsiImageRender"

//import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';

const { ethers } = require("ethers");
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

function MainScroll() {
  const classes = useStyles();
  // TODO fetch blocks from contract and render
  return (
    <div className={classes.root}>
      <Grid container justify="center">
        <div style={{padding: '5em'}}>
          <h2 style={{fontFamily: '"Roboto", sans-serif', fontSize: '4em', textAlign: 'center', fontWeight: 800}} className='foobar'>Genesis Scroll</h2>
          <div className="ansi-grid-wrapper" style={{color: 'white', backgroundColor: 'black'}}>
            <Grid container >
              {'bbs1.ans|bbs2.ans|bbs3.ans|info1.txt'.split('|').map((uri, i) => (
                      <div key={"ansi1-" + i} className="ansi-wrapper" style={{maxWidth: 400}}>
                        <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', width: 270 }} tokenURI={uri} />
                      </div>
              ))}
            </Grid><Grid container spacing={3,0} >
              {'bbs4.ans|bbs5.ans|bbs6.ans|info2.txt'.split('|').map((uri, i) => (
                      <div key={"ansi1-" + i} className="ansi-wrapper" style={{maxWidth: 400}}>
                        <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', width: 270 }} tokenURI={uri} />
                      </div>
              ))}
            </Grid><Grid container spacing={3,0} >
              {'tna1.ans|tna2.ans|tnb1.ans|info3.txt'.split('|').map((uri, i) => (
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
        </div>
      </Grid>
      <Grid container spacing={3}>
        <Grid item>
          <p>
            <a href="#">View more...</a>
          </p>
        </Grid>
      </Grid>
    </div>
  )
}
function RecentlySavedBlocks({limit}) {
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

function MintBlockCard({ readContracts, blockMintFee } ) {
  //const tokenSupply = useContractReader(readContracts, "BBoard", "tokenSupply");
  const tokenSupply = useContractReader(readContracts, "BBoard", "getBBlockIdCounter");

  const nextBlockID = tokenSupply ? tokenSupply.toNumber() + 1 : 0; // XXX check, off by 1?
  const classes = useStyles();
  return (
        <Grid item xs >
          <Paper className={classes.paper}>
            <div className="ansi-wrapper" style={{color: 'white', maxWidth: 400}}>
              <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', height: 240, width: 284 }} tokenURI={'buynextblock.txt'} />
            </div>
            <h3>THIS NEXT BLOCK COULD BE YOURS!!!</h3>
            <h3>Mint fee: {blockMintFee ? blockMintFee.toString() : '...loading' }</h3>
            <ul><li>Row: {Math.floor(nextBlockID / 4)}</li><li>Col: {nextBlockID % 4}</li><li>Owner: YOU???</li></ul>
          </Paper>
        </Grid>
  )
}

function MyBlockCard({ readContracts, index, ownerAddress } ) {
  const tokenId = useContractReader(readContracts, "BBoard", "tokenOfOwnerByIndex", [ownerAddress, index]);
  const tokenUri = useContractReader(readContracts, "BBoard", "tokenURI", [tokenId]);
  const classes = useStyles();
  return (
        <Grid item xs >
          <Paper className={classes.paper} style={{maxWidth: 400}}>
            <div className="ansi-wrapper">
              <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', height: 240, width: 284 }} tokenURI={tokenUri ? tokenUri : 'tna1.ans'} />
            </div>
            <h3>FILE: {tokenUri}</h3>
            <ul><li>Row: {Math.floor(index / 4)}</li><li>Col: {index % 4}</li><li>Owner: {ownerAddress}</li></ul>
          </Paper>
        </Grid>
  )
}

export default function MyBlocks({
  blockMintFee,
  myBBlocksCount,
  my1stBBlockTokenId,
  my1stBBlockTokenURI,
  purpose,
  setPurposeEvents,
  address,
  filterAddress,
  setFilterAddress,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newFilterAddress, setNewFilterAddress] = useState();
  const [addressBlockCount, setAddressBlockCount] = useState('...');

  const blocksCount = myBBlocksCount ? (
    address == filterAddress ? myBBlocksCount.toNumber() : addressBlockCount
  ) : 0;

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, /*width: 400,*/ margin: "auto", marginTop: 64 }}>
        <h2>Bulletin Block System Permissionless Distributed UI:</h2>
        {/* <h4>purpose: {purpose}</h4> */}
        <MainScroll />
        <Grid container justify="center">
          <Grid item>
            <h2 style={{fontFamily: '"Roboto", sans-serif', fontSize: '4em', fontWeight: 800}} className='foobar'>Your Blocks ({blocksCount})</h2>
            <p>currently {addressBlockCount} blocks at {address}</p>
            <Input
              onChange={e => {
                setNewFilterAddress(e.target.value);
              }}
            />
            <Button>XXX Bug: copy your address and click below</Button>
            <Button
              style={{ marginTop: 8 }}
              onClick={async () => {
                let addr;
                try {
                  addr = ethers.utils.getAddress(newFilterAddress);
                } catch(e) {
                  console.log('bad address ', newFilterAddress);
                  return;
                }
                setFilterAddress(addr);
                const result = await tx(readContracts.BBoard.balanceOf(addr));
                setAddressBlockCount(result.toNumber());
              }}
            >Show Blocks of Another Address
            </Button>
            <Grid container spacing={3,0} >
              {
                [...Array(blocksCount).keys()].map(i =>
                  (<MyBlockCard readContracts={readContracts} index={i} ownerAddress={filterAddress} />)
                )
              }
            </Grid>
            <Grid container spacing={3}>
              <Grid item>
                <p>
                  <a href="#">Load more... (assuming there are more)</a>
                </p>
              </Grid>
            </Grid>
            <h2 style={{fontFamily: '"Roboto", sans-serif', fontSize: '4em', fontWeight: 800}} className='foobar'>Mint/Buy a Block</h2>
            <Grid container justify="center"><Grid item>
              <MintBlockCard readContracts={readContracts} blockMintFee={blockMintFee} />
            </Grid></Grid>
            <Button
              /* MUI color="primary" variant="outlined" */
              type="primary" size="large"
              style={{ marginTop: 8 }}
              onClick={async () => {
                /* look how you call setPurpose on your contract: */
                /* notice how you pass a call back for tx updates too */
                const result = tx(writeContracts.BBoard.createToken({
                  value: blockMintFee
                }), update => {
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    console.log(
                      " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                    );
                  }
                });
                console.log("awaiting metamask/web3 confirm result...", result);
                console.log(await result);
              }}
            >
              Mint!
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <RecentlySavedBlocks limit={3} />
        <Divider />
      </div>
    </div>
  );
}
